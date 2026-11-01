'use server';

import { fail, ok, requireAdmin, withDb } from '@/lib/actions/utils';
import { destroyImage } from '@/lib/cloudinary';
import { PUBLIC_ID_PATTERN } from '@/lib/image-constants';
import type { ActionResult } from '@/lib/menu-types';
import { Dish } from '@/models';

/** Deletes an image that was uploaded but never saved with a dish. */
export async function removeUploadedImage(publicId: string): Promise<ActionResult<null>> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!PUBLIC_ID_PATTERN.test(publicId)) return fail('Invalid image.');

  return withDb({ label: 'removeUploadedImage', failMessage: 'Could not remove the image.' }, async () => {
    // Never delete a photo a saved dish is using.
    if (await Dish.exists({ imagePublicId: publicId })) return fail('That image is in use.');
    await destroyImage(publicId);
    return ok(null);
  });
}
