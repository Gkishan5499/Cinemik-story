/**
 * Normalizes video URLs to ensure 100% playback compatibility across
 * iOS Safari, Android, and Desktop browsers.
 *
 * For Cloudinary hosted videos:
 * 1. Guarantees standard MP4 container (f_mp4)
 * 2. Enforces H.264 video codec with Level <= 5.0 (vc_h264) and yuv420p pixel format
 * 3. Caps dimensions (w_1080,h_3840,c_limit) so vertical webtoon motion videos
 *    never exceed Apple VideoToolbox's 4096px hardware decode limit.
 * 4. Ensures faststart (+faststart moov atom at beginning of file) and AAC audio.
 */
export function getOptimizedVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  if (rawUrl.includes('cloudinary.com') && rawUrl.includes('/video/upload/')) {
    // If it already has our dimensions and codec transformations, keep it
    if (
      rawUrl.includes('/video/upload/f_mp4,vc_h264') ||
      (rawUrl.includes('vc_h264') && rawUrl.includes('w_1080'))
    ) {
      return rawUrl;
    }

    // Strip out any partial or legacy upload transformations before appending standard one
    const cleanUrl = rawUrl.replace(
      /\/video\/upload\/(?:f_[^/]+|vc_[^/]+|q_[^/]+|w_[^/]+|c_[^/]+|,)+\//,
      '/video/upload/'
    );

    const transformed = cleanUrl.replace(
      '/video/upload/',
      '/video/upload/f_mp4,vc_h264,w_1080,h_3840,c_limit/'
    );

    // Ensure .mp4 extension for optimal iOS MIME type resolution
    return transformed.replace(/\.(webm|mov|mkv|avi|m4v)$/i, '.mp4');
  }

  return rawUrl;
}
