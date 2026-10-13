import React from "react";
import { Link } from "react-router-dom";
import StreamingIndicator from "../streaming/StreamingIndicator";
import Poster from "../common/Poster";
import { useTranslation } from "../../i18n/I18nContext";

const MediaList = ({ title, items, type }) => {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <section>
      <div className="cm-section-title">
        <h2>{title}</h2>
        <span className="cm-count">
          {t("explore.titleCount", { count: items.length })}
        </span>
      </div>
      <div className="cm-poster-grid">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  );
};

export default MediaList;

export const MediaCard = ({ item, type }) => {
  const detailsPath =
    type === "movie" ? `/movies/${item.id}` : `/series/${item.id}`;
  const rating = formatRating(item);
  const year = item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : item.releaseYear;

  return (
    <Link to={detailsPath} className="cm-ticket-card">
      <div className="cm-ticket-poster">
        <Poster src={item.posterUrl} title={item.title} />
        <StreamingIndicator
          mediaId={item.id}
          mediaType={type === "movie" ? "movies" : "series"}
          maxProviders={2}
        />
      </div>
      <div className="cm-ticket-stub-info">
        <h3 className="cm-ticket-title">{item.title}</h3>
        <div className="cm-ticket-meta">
          <span>
            {year || "—"}
            {item.genreArray?.[0] && <> · {item.genreArray[0]}</>}
          </span>
          {rating && (
            <span className="cm-rating">
              <i className="bi bi-star-fill" aria-hidden="true" /> {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/**
 * formats the rating of a media item
 * @param {*} item
 * @returns {string|null} - Formatted rating string, null when unrated
 */
const formatRating = (item) => {
  const rating =
    item.currentRating !== undefined ? item.currentRating : item.rating;

  if (rating === null || rating === undefined) return null;

  const numRating = Number(rating);

  if (isNaN(numRating) || numRating === 0) return null;

  return numRating.toFixed(1);
};
