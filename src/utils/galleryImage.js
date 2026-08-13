export function galleryImageUrl(
  url,
  {
    width = 1200,
    quality = 80,
  } = {},
) {
  if (!url) {
    return "";
  }

  return `/cdn-cgi/image/width=${width},quality=${quality},format=auto${url}`;
}
