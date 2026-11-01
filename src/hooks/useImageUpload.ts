'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { removeUploadedImage, uploadImage } from '@/lib/actions/upload';
import { prepareImage } from '@/lib/image';
import type { UploadedImage, UploadStatus } from '@/lib/menu-types';

/** A photo that is already saved with a dish (edit mode). */
export interface SavedImage {
  url: string;
  publicId: string;
}

async function uploadFile(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', file);
  const result = await uploadImage(formData);
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

/**
 * The photo state machine for a dish form: pick -> optimise -> upload, plus the saved photo when editing.
 * Every select/clear bumps `request`, so a slow upload that finishes after the user moved on is ignored
 * (and its Cloudinary file removed) instead of resurrecting a photo the form no longer shows.
 */
export function useImageUpload(saved: SavedImage | null = null) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string>();
  const [existing, setExisting] = useState<SavedImage | null>(saved);

  const rawFile = useRef<File | null>(null);
  const uploadedRef = useRef<UploadedImage | null>(null);
  const request = useRef(0);

  const discardMutation = useMutation({ mutationFn: removeUploadedImage });
  const uploadMutation = useMutation({ mutationFn: uploadFile });

  /** Delete a file that was uploaded but never saved with a dish. */
  const discard = (publicId: string) => discardMutation.mutate(publicId);

  const clear = () => {
    request.current += 1;
    rawFile.current = null;
    uploadedRef.current = null;
    setFile(null);
    setStatus('idle');
    setUploaded(null);
    setError(undefined);
  };

  const select = async (raw: File) => {
    if (uploadedRef.current) discard(uploadedRef.current.publicId);
    uploadedRef.current = null;
    const id = ++request.current;
    rawFile.current = raw;
    setUploaded(null);
    setError(undefined);
    setFile(raw);
    setStatus('processing');

    try {
      const prepared = await prepareImage(raw);
      if (id !== request.current) return;
      setFile(prepared);
      setStatus('uploading');

      const result = await uploadMutation.mutateAsync(prepared);
      if (id !== request.current) {
        discard(result.publicId);
        return;
      }
      uploadedRef.current = result;
      setUploaded(result);
      setStatus('uploaded');
    } catch (e) {
      if (id !== request.current) return;
      setStatus('error');
      setError(e instanceof Error && e.message ? e.message : 'Could not read that image.');
    }
  };

  /** Remove the photo from the form: drops an unsaved upload and the saved photo. */
  const remove = () => {
    if (uploadedRef.current) discard(uploadedRef.current.publicId);
    clear();
    setExisting(null);
  };

  /** Back to the starting state (the saved photo, if any); unsaved uploads are deleted. */
  const reset = () => {
    if (uploadedRef.current) discard(uploadedRef.current.publicId);
    clear();
    setExisting(saved);
  };

  /** The dish was saved: its photo now belongs to the dish, so forget it without deleting anything. */
  const release = () => {
    clear();
  };

  // Leaving the form (Cancel, or another row opened for editing) deletes an unsaved upload.
  useEffect(
    () => () => {
      request.current += 1;
      if (uploadedRef.current) void removeUploadedImage(uploadedRef.current.publicId).catch(() => undefined);
    },
    [],
  );

  return {
    file,
    status,
    error,
    existingUrl: file ? undefined : existing?.url,
    /** What to save with the dish: the new upload if there is one, otherwise the saved photo. */
    publicId: uploaded?.publicId ?? existing?.publicId,
    busy: status === 'processing' || status === 'uploading',
    select,
    retry: () => {
      if (rawFile.current) void select(rawFile.current);
    },
    remove,
    reset,
    release,
  };
}
