import { Resend } from "resend";
import { verifyTurnstile } from "../_utils/turnstile";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "ESC-";

  for (let i = 0; i < 6; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }

  return value;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getExtension(file) {
  const typeMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  return typeMap[file.type] || "bin";
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize),
    );
  }

  return btoa(binary);
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    /*
     * Required bindings / secrets
     */
    if (!env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        500,
      );
    }

    if (!env.TURNSTILE_SECRET) {
      console.error("TURNSTILE_SECRET is not configured.");

      return json(
        {
          success: false,
          message: "Security verification is not configured.",
        },
        500,
      );
    }

    if (!env.QUOTE_IMAGES) {
      console.error("QUOTE_IMAGES R2 binding is not configured.");

      return json(
        {
          success: false,
          message: "Photo storage is not configured.",
        },
        500,
      );
    }

    /*
     * D1 database binding
     */
    if (!env.ecosurfacecare_db) {
      console.error(
        "D1 binding ecosurfacecare_db is not configured.",
      );

      return json(
        {
          success: false,
          message: "Quote storage is not configured.",
        },
        500,
      );
    }

    /*
     * Request format
     */
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return json(
        {
          success: false,
          message: "Unsupported request format.",
        },
        415,
      );
    }

    const formData = await request.formData();

    /*
     * TURNSTILE SECURITY CHECK
     *
     * This happens before:
     * - generating the quote reference
     * - uploading photos
     * - using R2 storage
     * - writing to D1
     * - sending emails
     */
    const turnstileToken = String(
      formData.get("turnstileToken") || "",
    ).trim();

    if (!turnstileToken) {
      return json(
        {
          success: false,
          message:
            "Please complete the security check and try again.",
        },
        403,
      );
    }

    const turnstileResult = await verifyTurnstile({
      token: turnstileToken,
      secret: env.TURNSTILE_SECRET,
      request,
    });

    if (!turnstileResult.success) {
      console.warn(
        "Quote Turnstile verification failed:",
        turnstileResult["error-codes"] ||
          turnstileResult.reason ||
          "Unknown Turnstile error",
      );

      return json(
        {
          success: false,
          message:
            "Security verification failed. Please refresh the page and try again.",
        },
        403,
      );
    }

    /*
     * Read form fields
     */
    const name = String(
      formData.get("name") || "",
    ).trim();

    const email = String(
      formData.get("email") || "",
    ).trim();

    const phone = String(
      formData.get("phone") || "",
    ).trim();

    const postcode = String(
      formData.get("postcode") || "",
    ).trim();

    const propertyType = String(
      formData.get("propertyType") || "",
    ).trim();

    const service = String(
      formData.get("service") || "",
    ).trim();

    const description = String(
      formData.get("description") || "",
    ).trim();

    const consent =
      formData.get("consent") === "on";

    /*
     * Required field validation
     */
    if (
      !name ||
      !email ||
      !phone ||
      !postcode ||
      !propertyType ||
      !service ||
      !description ||
      !consent
    ) {
      return json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        400,
      );
    }

    /*
     * Email validation
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return json(
        {
          success: false,
          message:
            "Please provide a valid email address.",
        },
        400,
      );
    }

    /*
     * Generate quote reference
     */
    const reference = createReference();

    /*
     * Photo validation
     */
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ]);

    const maxPhotos = 5;
    const maxFileSize = 12 * 1024 * 1024;

    const submittedPhotos = formData
      .getAll("photos")
      .filter(
        (item) =>
          typeof File !== "undefined" &&
          item instanceof File &&
          item.size > 0,
      );

    if (submittedPhotos.length > maxPhotos) {
      return json(
        {
          success: false,
          message:
            `You can upload up to ${maxPhotos} photos.`,
        },
        400,
      );
    }

    for (const photo of submittedPhotos) {
      if (!allowedTypes.has(photo.type)) {
        return json(
          {
            success: false,
            message:
              "Please upload JPG, PNG, WebP, HEIC or HEIF images only.",
          },
          400,
        );
      }

      if (photo.size > maxFileSize) {
        return json(
          {
            success: false,
            message:
              "Each photo must be smaller than 12 MB.",
          },
          400,
        );
      }
    }

    /*
     * Store photos in R2
     */
    const uploadedPhotos = [];

    for (
      let index = 0;
      index < submittedPhotos.length;
      index += 1
    ) {
      const photo = submittedPhotos[index];
      const extension = getExtension(photo);

      const key =
        `quotes/${reference}/photo-${index + 1}.${extension}`;

      const arrayBuffer =
        await photo.arrayBuffer();

      await env.QUOTE_IMAGES.put(
        key,
        arrayBuffer,
        {
          httpMetadata: {
            contentType: photo.type,
          },

          customMetadata: {
            quoteReference: reference,
            originalFilename: photo.name,
          },
        },
      );

      uploadedPhotos.push({
        key,
        filename: photo.name,
        size: photo.size,
        type: photo.type,
        content: arrayBuffer,
      });
    }

    /*
     * Store quote metadata in D1
     *
     * R2 stores the photographs.
     * D1 stores the structured quote information.
     */
    try {
      await env.ecosurfacecare_db
        .prepare(
          `
            INSERT INTO quotes (
              reference,
              name,
              email,
              phone,
              postcode,
              property_type,
              service,
              description,
              photo_count,
              status,
              quoted_amount_pence,
              appointment_at,
              created_at,
              updated_at
            )
            VALUES (
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              'new'
            )
          `,
        )
        .bind(
          reference,
          name,
          email,
          phone,
          postcode,
          propertyType,
          service,
          description,
          uploadedPhotos.length,
        )
        .run();
    } catch (databaseError) {
      console.error(
        "Failed to store quote in D1:",
        databaseError,
      );

      /*
       * Remove any photos already uploaded for this
       * quote so we don't leave orphaned R2 objects
       * when the D1 record cannot be created.
       */
      for (const photo of uploadedPhotos) {
        try {
          await env.QUOTE_IMAGES.delete(photo.key);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up R2 photo:",
            photo.key,
            cleanupError,
          );
        }
      }

      return json(
        {
          success: false,
          message:
            "We could not save your quote request. Please try again.",
        },
        500,
      );
    }

    /*
     * Escape customer values before inserting
     * them into HTML emails.
     */
    const safe = {
      reference: escapeHtml(reference),
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      postcode: escapeHtml(postcode),
      propertyType:
        escapeHtml(propertyType),
      service: escapeHtml(service),
      description: escapeHtml(description),
    };

    /*
     * Create Resend-compatible attachments
     */
    const attachments = uploadedPhotos.map(
      (photo) => ({
        filename: photo.filename,
        content: arrayBufferToBase64(
          photo.content,
        ),
      }),
    );

    /*
     * Photo information shown in business email
     */
    const photoSummary =
      uploadedPhotos.length > 0
        ? `
          <h2 style="margin-top:28px;">
            Photos
          </h2>

          <p>
            ${uploadedPhotos.length}
            photo${
              uploadedPhotos.length === 1
                ? ""
                : "s"
            }
            uploaded and attached to this email.
          </p>

          <ul>
            ${uploadedPhotos
              .map(
                (photo) =>
                  `<li>${escapeHtml(
                    photo.filename,
                  )}</li>`,
              )
              .join("")}
          </ul>

          <p style="font-size:13px;color:#667085;">
            A secure copy is also stored under
            quotes/${safe.reference}/
          </p>
        `
        : `
          <h2 style="margin-top:28px;">
            Photos
          </h2>

          <p>
            No photos were supplied with this request.
          </p>
        `;

    /*
     * Initialise Resend
     */
    const resend =
      new Resend(env.RESEND_API_KEY);

    /*
     * EMAIL 1
     * Internal business notification
     */
    const internalEmail =
      await resend.emails.send({
        from:
          "EcoSurfaceCare Quotes <quotes@notifications.ecosurfacecare.co.uk>",

        to: ["bb@groutgleam.co.uk"],

        replyTo: email,

        subject:
          `New EcoSurfaceCare quote request — ${reference}`,

        attachments,

        html: `
          <div
            style="
              font-family:Arial,sans-serif;
              max-width:680px;
              margin:0 auto;
              color:#173b1a;
            "
          >
            <h1 style="color:#228b22;">
              New quote request
            </h1>

            <p>
              A new quote request has been submitted through
              the EcoSurfaceCare website.
            </p>

            <div
              style="
                background:#f5faf3;
                border:1px solid #dce7dc;
                border-radius:16px;
                padding:20px;
                margin:24px 0;
              "
            >
              <p>
                <strong>Reference:</strong>
                ${safe.reference}
              </p>

              <p>
                <strong>Name:</strong>
                ${safe.name}
              </p>

              <p>
                <strong>Email:</strong>
                ${safe.email}
              </p>

              <p>
                <strong>Phone:</strong>
                ${safe.phone}
              </p>

              <p>
                <strong>Postcode:</strong>
                ${safe.postcode}
              </p>

              <p>
                <strong>Property type:</strong>
                ${safe.propertyType}
              </p>

              <p>
                <strong>Service:</strong>
                ${safe.service}
              </p>
            </div>

            <h2>
              Project description
            </h2>

            <p
              style="
                white-space:pre-wrap;
                line-height:1.6;
              "
            >
              ${safe.description}
            </p>

            ${photoSummary}

            <hr
              style="
                border:none;
                border-top:1px solid #dce7dc;
                margin:28px 0;
              "
            />

            <p
              style="
                font-size:13px;
                color:#667085;
              "
            >
              Reply to this email to respond directly to
              ${safe.name}.
            </p>
          </div>
        `,
      });

    /*
     * The business must receive the enquiry.
     */
    if (internalEmail.error) {
      console.error(
        "Internal quote email failed:",
        internalEmail.error,
      );

      return json(
        {
          success: false,
          message:
            "We could not send your quote request. Please try again.",
        },
        502,
      );
    }

    /*
     * EMAIL 2
     * Customer confirmation
     */
    const customerEmail =
      await resend.emails.send({
        from:
          "EcoSurfaceCare <quotes@notifications.ecosurfacecare.co.uk>",

        to: [email],

        replyTo:
          "contact@ecosurfacecare.co.uk",

        subject:
          `We received your EcoSurfaceCare quote request — ${reference}`,

        html: `
          <div
            style="
              font-family:Arial,sans-serif;
              max-width:680px;
              margin:0 auto;
              color:#173b1a;
            "
          >
            <h1 style="color:#228b22;">
              Thank you, ${safe.name}
            </h1>

            <p
              style="
                font-size:16px;
                line-height:1.7;
              "
            >
              We've received your EcoSurfaceCare quote request
              and will review the information you provided.
            </p>

            <div
              style="
                background:#f5faf3;
                border:1px solid #dce7dc;
                border-radius:16px;
                padding:20px;
                margin:24px 0;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:14px;
                  color:#667085;
                "
              >
                Your reference
              </p>

              <p
                style="
                  margin:6px 0 0;
                  font-size:24px;
                  font-weight:bold;
                  color:#228b22;
                "
              >
                ${safe.reference}
              </p>
            </div>

            ${
              uploadedPhotos.length > 0
                ? `
                  <p
                    style="
                      font-size:16px;
                      line-height:1.7;
                    "
                  >
                    We also received
                    ${uploadedPhotos.length}
                    photo${
                      uploadedPhotos.length === 1
                        ? ""
                        : "s"
                    }
                    with your request.
                  </p>
                `
                : ""
            }

            <p
              style="
                font-size:16px;
                line-height:1.7;
              "
            >
              Please keep this reference in case you need
              to contact us about your enquiry.
            </p>

            <p
              style="
                font-size:16px;
                line-height:1.7;
              "
            >
              If you need to add anything else, simply
              reply to this email.
            </p>

            <p style="margin-top:32px;">
              EcoSurfaceCare
              <br />
              Professional Cleaning, Restoration &amp; Maintenance
            </p>

            <p style="font-size:14px;">
              07873 945808
              <br />
              contact@ecosurfacecare.co.uk
            </p>
          </div>
        `,
      });

    /*
     * Don't fail the quote if only the customer
     * confirmation email fails.
     */
    if (customerEmail.error) {
      console.error(
        "Customer confirmation email failed:",
        customerEmail.error,
      );
    }

    /*
     * Server-side log
     */
    console.log(
      "New EcoSurfaceCare quote request",
      {
        reference,
        name,
        email,
        phone,
        postcode,
        propertyType,
        service,
        photoCount:
          uploadedPhotos.length,
        databaseStored: true,
        turnstileVerified: true,
      },
    );

    /*
     * Successful response
     */
    return json({
      success: true,

      reference,

      photoCount:
        uploadedPhotos.length,

      message:
        uploadedPhotos.length > 0
          ? `Your quote request and ${
              uploadedPhotos.length
            } photo${
              uploadedPhotos.length === 1
                ? ""
                : "s"
            } have been received.`
          : "Your quote request has been received.",
    });
  } catch (error) {
    console.error(
      "Quote submission error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      500,
    );
  }
}
