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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    /*
     * Required secrets
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

    /*
     * Request format
     */
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return json(
        {
          success: false,
          message: "Unsupported request format.",
        },
        415,
      );
    }

    const body = await request.json();

    /*
     * TURNSTILE SECURITY CHECK
     *
     * This happens before any email is sent.
     */
    const turnstileToken = String(
      body.turnstileToken || "",
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
        "Contact Turnstile verification failed:",
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
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    /*
     * Required field validation
     */
    if (!name || !email || !message) {
      return json(
        {
          success: false,
          message:
            "Please complete your name, email address and message.",
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
          message: "Please provide a valid email address.",
        },
        400,
      );
    }

    /*
     * Length validation
     */
    if (name.length > 120) {
      return json(
        {
          success: false,
          message: "Please enter a shorter name.",
        },
        400,
      );
    }

    if (phone.length > 40) {
      return json(
        {
          success: false,
          message: "Please enter a valid phone number.",
        },
        400,
      );
    }

    if (message.length > 5000) {
      return json(
        {
          success: false,
          message:
            "Your message is too long. Please shorten it and try again.",
        },
        400,
      );
    }

    /*
     * Escape customer-provided values before inserting into HTML
     */
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    /*
     * Initialise Resend
     */
    const resend = new Resend(env.RESEND_API_KEY);

    /*
     * EMAIL 1
     *
     * Internal business notification
     */
    const internalEmail = await resend.emails.send({
      from:
        "EcoSurfaceCare <contact@notifications.ecosurfacecare.co.uk>",

      to: ["bb@groutgleam.co.uk"],

      replyTo: email,

      subject:
        `New EcoSurfaceCare website enquiry — ${name}`,

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
            New website enquiry
          </h1>

          <p>
            A new general enquiry has been submitted through
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
              <strong>Name:</strong>
              ${safe.name}
            </p>

            <p>
              <strong>Email:</strong>
              ${safe.email}
            </p>

            <p>
              <strong>Phone:</strong>
              ${safe.phone || "Not provided"}
            </p>
          </div>

          <h2>
            Message
          </h2>

          <p
            style="
              white-space:pre-wrap;
              line-height:1.7;
            "
          >
            ${safe.message}
          </p>

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
     * If the business notification fails,
     * the contact submission should fail.
     */
    if (internalEmail.error) {
      console.error(
        "Internal contact email failed:",
        internalEmail.error,
      );

      return json(
        {
          success: false,
          message:
            "We could not send your enquiry. Please try again.",
        },
        502,
      );
    }

    /*
     * EMAIL 2
     *
     * Customer confirmation
     */
    const customerEmail = await resend.emails.send({
      from:
        "EcoSurfaceCare <contact@notifications.ecosurfacecare.co.uk>",

      to: [email],

      replyTo: "contact@ecosurfacecare.co.uk",

      subject:
        "We've received your EcoSurfaceCare enquiry",

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
            We've received your message and will get back
            to you as soon as reasonably possible.
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
              Your message
            </p>

            <p
              style="
                margin:10px 0 0;
                white-space:pre-wrap;
                line-height:1.7;
              "
            >
              ${safe.message}
            </p>
          </div>

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
     * Do not fail the entire enquiry if only
     * the customer confirmation fails.
     */
    if (customerEmail.error) {
      console.error(
        "Customer contact confirmation failed:",
        customerEmail.error,
      );
    }

    /*
     * Server log
     */
    console.log(
      "New EcoSurfaceCare contact enquiry",
      {
        name,
        email,
        phone: phone || "Not provided",
        turnstileVerified: true,
      },
    );

    /*
     * Successful response
     */
    return json({
      success: true,
      message:
        "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "Contact submission error:",
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
