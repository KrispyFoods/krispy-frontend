import { type ImageType, IMAGE_TYPES, MAX_RAW_BYTES, MAX_UPLOAD_BYTES } from '@/lib/image-constants';

/** Browser-side image prep, run before a photo is sent to the upload server action. */

const MAX_EDGE = 1600;

export class ImageError extends Error {}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates the file, then downsizes it (longest edge 1600px) and re-encodes it as WebP so the upload
 * stays small. Falls back to the original file if the browser can't decode it.
 */
export async function prepareImage(file: File): Promise<File> {
  if (!IMAGE_TYPES.includes(file.type as ImageType)) throw new ImageError('Use a JPG, PNG or WebP image.');
  if (file.size > MAX_RAW_BYTES) throw new ImageError('Image must be 10 MB or smaller.');

  let result = file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
      if (blob && blob.type === 'image/webp' && blob.size < file.size) {
        result = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
      }
    }
    bitmap.close();
  } catch {
    // keep the original file
  }

  if (result.size > MAX_UPLOAD_BYTES) {
    throw new ImageError('Image is still over 4 MB after optimising. Try a smaller photo.');
  }
  return result;
}
