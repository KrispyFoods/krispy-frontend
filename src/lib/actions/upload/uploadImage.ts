'use server';

import { fail, logError, ok } from '@/lib/actions/utils';
import { uploadBuffer } from '@/lib/cloudinary';
import { CLOUDINARY_FOLDER, MAX_UPLOAD_BYTES } from '@/lib/image-constants';
import { sniffImageType } from '@/lib/image-sniff';
import type { ActionResult, UploadedImage } from '@/lib/menu-types';

export async function uploadImage(formData: FormData): Promise<ActionResult<UploadedImage>> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return fail('Choose an image to upload.');
  if (file.size > MAX_UPLOAD_BYTES) return fail('Image must be 4 MB or smaller.');

  const buffer = Buffer.from(await file.arrayBuffer());
  // Trust the bytes, not the file name or the MIME type the browser reported.
  if (!sniffImageType(buffer)) return fail('Use a JPG, PNG or WebP image.');

  try {
    const result = await uploadBuffer(buffer, CLOUDINARY_FOLDER);
    return ok({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    logError('uploadImage', error);
    return fail('The upload failed. Try again.');
  }
}
