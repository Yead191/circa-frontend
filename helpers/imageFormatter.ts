
export function imageFormatter(imageurl: string | null | undefined) {
    // if (!imageurl) return undefined;
    if (imageurl?.startsWith("/asset")) return "http://10.10.7.9:5005" + imageurl;
    if (imageurl?.startsWith("http") || imageurl?.startsWith('blob:')) return imageurl;
    return (
        (process.env.IMAGE_BASE_URL || "http://10.10.7.9:5005/files") + imageurl
    );
}