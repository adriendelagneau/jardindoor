/**
 * Cloudinary URL transformation utility
 * Optimizes images using Cloudinary's transformation API
 */

type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "scale" | "fit" | "thumb";
    blurRadius?: number; 
};

const DEFAULT_QUALITY = 80;
const DEFAULT_FORMAT: TransformOptions["format"] = "auto";

/**
 * Transforms a Cloudinary image URL with optimization parameters
 * Uses f_auto for automatic best format (WebP/AVIF) and q_auto for automatic quality
 */
function cloudinaryUrl(
  url: string,
  options: TransformOptions = {}
): string {
  const {
    width,
    height,
    quality = DEFAULT_QUALITY,
    format = DEFAULT_FORMAT,
    crop,
    blurRadius
  } = options;

  // Validate URL
  if (!url || typeof url !== "string") {
    return url;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes("/upload/")) {
    return url;
  }

  try {
    const [base, path] = url.split("/upload/");

    // Build transformation string
    const transformations: string[] = [];

    // Use automatic format for best compression (WebP/AVIF)
    transformations.push(`f_${format}`);

    // Use automatic quality for optimal file size
    transformations.push(`q_${quality}`);

    // Add dimensions if specified
    if (width) {
      transformations.push(`w_${width}`);
    }

    if (height) {
      transformations.push(`h_${height}`);
    }

    // Add crop mode if specified
    if (crop) {
      transformations.push(`c_${crop}`);
    }


    if (blurRadius) {
  transformations.push(`e_blurRadius:${blurRadius}`);
}
    const transformationString = transformations.join(",");

    return `${base}/upload/${transformationString}/${path}`;
  } catch {
    // Fallback to original URL if transformation fails
    return url;
  }
}


export default cloudinaryUrl;
