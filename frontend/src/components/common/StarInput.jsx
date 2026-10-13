import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/**
 * Five star input with half-star precision.
 */
const StarInput = ({ value, onChange, size = 32, label }) => {
  const [hover, setHover] = useState(null);
  const shown = hover || value;

  return (
    <div className="cm-star-input" role="group" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="position-relative"
          style={{ fontSize: size, cursor: "pointer", lineHeight: 1 }}
        >
          <span
            className="cm-star-half cm-star-half-left"
            role="button"
            aria-label={`${star - 0.5}`}
            onClick={() => onChange(star - 0.5)}
            onMouseEnter={() => setHover(star - 0.5)}
            onMouseLeave={() => setHover(null)}
          />
          <span
            className="cm-star-half cm-star-half-right"
            role="button"
            aria-label={`${star}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
          {shown >= star ? (
            <FaStar color="var(--cm-brass)" />
          ) : shown >= star - 0.5 ? (
            <FaStarHalfAlt color="var(--cm-brass)" />
          ) : (
            <FaRegStar color="rgba(243, 233, 218, 0.3)" />
          )}
        </span>
      ))}
      <span className="cm-star-value">{shown ? shown.toFixed(1) : "–"}</span>
    </div>
  );
};

export default StarInput;
