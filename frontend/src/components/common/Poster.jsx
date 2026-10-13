import React, { useState } from "react";

/**
 * Poster image with a typographic fallback when the URL is missing or broken.
 */
const Poster = ({ src, title, className = "", style }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`cm-poster-fallback ${className}`}
        style={style}
        role="img"
        aria-label={title}
      >
        <span>{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
};

export default Poster;
