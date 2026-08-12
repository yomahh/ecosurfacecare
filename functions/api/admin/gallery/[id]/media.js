import { verifyAccess } from "../../../../_utils/access";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, private",
    },
  });
}

function getExtension(file) {
  const typeMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };

  return typeMap[file.type] || "bin";
}

function getMediaType(file) {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "image";
}

export async function onRequestPost(context) {
  try {
    const {
      request,
      env,
      params,
    } = context;

    const access = await verifyAccess(
      request,
      env,
    );

    if (!access.success) {
      return json(
        {
          success: false,
          message: access.message,
        },
        access.status,
      );
    }

    if (!env.ecosurfacecare_db) {
      return json(
        {
          success: false,
          message:
            "Gallery database is not configured.",
        },
        500,
      );
    }

    if (!env.QUOTE_IMAGES) {
      return json(
        {
          success: false,
          message:
            "Gallery media storage is not configured.",
        },
        500,
      );
    }

    const projectId = Number(
      params.id,
    );

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return json(
        {
          success: false,
          message:
            "Invalid gallery project ID.",
        },
        400,
      );
    }

    const project =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              id,
              title
            FROM gallery_projects
            WHERE id = ?
            LIMIT 1
          `,
        )
        .bind(projectId)
        .first();

    if (!project) {
      return json(
        {
          success: false,
          message:
            "Gallery project not found.",
        },
        404,
      );
    }

    const contentType =
      request.headers.get(
        "content-type",
      ) || "";

    if (
      !contentType.includes(
        "multipart/form-data",
      )
    ) {
      return json(
        {
          success: false,
          message:
            "Unsupported request format.",
        },
        415,
      );
    }

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const altText = String(
      formData.get("altText") || "",
    ).trim();

    if (
      typeof File === "undefined" ||
      !(file instanceof File) ||
      file.size <= 0
    ) {
      return json(
        {
          success: false,
          message:
            "Please select a media file.",
        },
        400,
      );
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
      "video/mp4",
      "video/webm",
    ]);

    if (!allowedTypes.has(file.type)) {
      return json(
        {
          success: false,
          message:
            "Please upload JPG, PNG, WebP, HEIC, HEIF, MP4 or WebM files only.",
        },
        400,
      );
    }

    const mediaType =
      getMediaType(file);

    const maxFileSize =
      mediaType === "video"
        ? 100 * 1024 * 1024
        : 15 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return json(
        {
          success: false,
          message:
            mediaType === "video"
              ? "Video files must be smaller than 100 MB."
              : "Image files must be smaller than 15 MB.",
        },
        400,
      );
    }

    const currentMedia =
      await env.ecosurfacecare_db
        .prepare(
          `
            SELECT
              COUNT(*) AS count
            FROM gallery_media
            WHERE project_id = ?
          `,
        )
        .bind(projectId)
        .first();

    const mediaCount =
      Number(
        currentMedia?.count || 0,
      );

    if (mediaCount >= 20) {
      return json(
        {
          success: false,
          message:
            "This gallery project already has the maximum of 20 media items.",
        },
        400,
      );
    }

    const extension =
      getExtension(file);

    const timestamp =
      Date.now();

    const random =
      crypto.randomUUID();

    const key =
      `gallery/${projectId}/${timestamp}-${random}.${extension}`;

    const arrayBuffer =
      await file.arrayBuffer();

    await env.QUOTE_IMAGES.put(
      key,
      arrayBuffer,
      {
        httpMetadata: {
          contentType: file.type,
        },

        customMetadata: {
          galleryProjectId:
            String(projectId),

          originalFilename:
            file.name,

          mediaType,
        },
      },
    );

    try {
      const result =
        await env.ecosurfacecare_db
          .prepare(
            `
              INSERT INTO gallery_media (
                project_id,
                r2_key,
                filename,
                content_type,
                alt_text,
                sort_order,
                media_type
              )
              VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
              )
            `,
          )
          .bind(
            projectId,
            key,
            file.name,
            file.type,
            altText || null,
            mediaCount,
            mediaType,
          )
          .run();

      await env.ecosurfacecare_db
        .prepare(
          `
            UPDATE gallery_projects
            SET
              updated_at =
                CURRENT_TIMESTAMP
            WHERE id = ?
          `,
        )
        .bind(projectId)
        .run();

      return json(
        {
          success: true,

          media: {
            id:
              result.meta.last_row_id,

            project_id:
              projectId,

            r2_key: key,

            filename:
              file.name,

            content_type:
              file.type,

            alt_text:
              altText || null,

            sort_order:
              mediaCount,

            media_type:
              mediaType,
          },
        },
        201,
      );
    } catch (databaseError) {
      console.error(
        "Gallery media D1 insert failed:",
        databaseError,
      );

      try {
        await env.QUOTE_IMAGES.delete(
          key,
        );
      } catch (cleanupError) {
        console.error(
          "Gallery media R2 cleanup failed:",
          key,
          cleanupError,
        );
      }

      return json(
        {
          success: false,
          message:
            "Unable to save gallery media.",
        },
        500,
      );
    }
  } catch (error) {
    console.error(
      "Admin gallery media upload error:",
      error,
    );

    return json(
      {
        success: false,
        message:
          "Unable to upload gallery media.",
      },
      500,
    );
  }
}
