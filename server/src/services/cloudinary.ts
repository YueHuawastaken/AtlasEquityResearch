import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export function isCloudinaryReady() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

export async function uploadBufferToCloudinary(buffer: Buffer, options: { fileName: string; mimeType: string }) {
  if (!isCloudinaryReady()) {
    throw new Error("Cloudinary is not configured");
  }

  return await new Promise<{ secure_url: string; public_id: string; resource_type: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: options.mimeType.startsWith("image/") ? "image" : "raw",
        public_id: options.fileName
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({ secure_url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type });
      }
    );

    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, mimeType: string) {
  if (!isCloudinaryReady()) {
    throw new Error("Cloudinary is not configured");
  }

  const resourceType = mimeType.startsWith("image/") ? "image" : "raw";
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

