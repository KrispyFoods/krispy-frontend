import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

/** The SDK reads CLOUDINARY_URL (cloudinary://key:secret@cloud_name) from the environment. */
function client() {
  if (!cloudinary.config().cloud_name) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_URL in .env.');
  }
  return cloudinary;
}

export function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = client().uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        unique_filename: true,
        overwrite: false,
        allowed_formats: ['jpg', 'png', 'webp'],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Cloudinary returned no result.'));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function destroyImage(publicId: string): Promise<void> {
  await client().uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
}

/** Delivery URL for one of our images, built on the server so clients can't point a dish at any URL. */
export function imageUrl(publicId: string): string {
  return client().url(publicId, { secure: true, resource_type: 'image', type: 'upload' });
}
