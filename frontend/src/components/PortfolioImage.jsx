const imageUrl = (src, width) => {
  const url = new URL(src);
  url.searchParams.set("w", width);
  url.searchParams.set("q", "76");
  url.searchParams.set("auto", "format");
  url.searchParams.delete("fm");
  return url.toString();
};

export const PortfolioImage = ({ src, alt, sizes, ...props }) => (
  <img
    src={imageUrl(src, 640)}
    srcSet={[360, 640, 960, 1280].map((width) => `${imageUrl(src, width)} ${width}w`).join(", ")}
    sizes={sizes}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
  />
);