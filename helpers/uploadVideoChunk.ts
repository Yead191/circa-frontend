/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAccessToken } from "./getAccessToken";

export interface ChunkUploadResult {
  done: boolean;
  url?: string;
}

/**
 * Forwards a single video chunk to the backend chunk-upload endpoint.
 * The backend appends each chunk to a file on disk and, once the final
 * chunk is received, responds with the stored video url (a JSON string
 * like "/myvideo.mp4"). Intermediate chunks respond with a status object.
 *
 * The client is expected to build the FormData with:
 *   - chunk        (the Blob slice, field name read by multer.single('chunk'))
 *   - originalname (a stable, unique file name for the whole upload)
 *   - chunkIndex   (0-based index of this chunk)
 *   - totalChunks  (total number of chunks)
 */
export const uploadVideoChunk = async (
  formData: FormData
): Promise<ChunkUploadResult> => {
  const accessToken = await getAccessToken();

  const res = await fetch(`${process.env.BASE_URL}/upload/chunk`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Chunk upload failed");
  }

  const json: any = await res.json();

  // Final chunk -> backend returns the url as a plain JSON string.
  if (typeof json === "string") {
    return { done: true, url: json };
  }

  return { done: false };
};
