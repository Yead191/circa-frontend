
export function getImageUrl(imageurl: string | null | undefined) {
  console.log(imageurl, 'get img')
  // if (!imageurl) return undefined;
  if (imageurl?.startsWith("/asset")) return process.env.IMAGE_BASE_URL || process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace("/files", "") + imageurl;
  if (imageurl?.startsWith("http") || imageurl?.startsWith('blob:')) return imageurl;
  return (
    (process.env.IMAGE_BASE_URL || process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://api.circa.chat/files") + imageurl
  );
}
