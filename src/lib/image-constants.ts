/** Image rules shared by the browser (pre-upload checks) and the server (authoritative checks). */

export type ImageType = 'image/jpeg' | 'image/png' | 'image/webp';

export const IMAGE_TYPES: readonly ImageType[] = ['image/jpeg', 'image/png', 'image/webp'];

/** Largest photo the picker accepts; it is downsized before upload. */
export const MAX_RAW_BYTES = 10 * 1024 * 1024;

/** Largest file the upload action accepts. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Cloudinary folder every dish photo lives in. */
export const CLOUDINARY_FOLDER = 'krispy/dishes';

/** A Cloudinary public id inside our folder, e.g. "krispy/dishes/abc123". */
export const PUBLIC_ID_PATTERN = new RegExp(`^${CLOUDINARY_FOLDER}/[\\w-]+$`);
