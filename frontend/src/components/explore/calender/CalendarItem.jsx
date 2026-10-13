import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Poster from "../../common/Poster";
import { useTranslation } from "../../../i18n/I18nContext";

const CalendarItem = ({ item }) => {
  const { t, locale } = useTranslation();
  const isMovie = item.contentType === "movie";
  const linkPath = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
  const releaseDate = isMovie ? item.releaseDate : item.nextEpisodeDate;
  const date = releaseDate ? new Date(releaseDate) : null;
  const validDate = date && !isNaN(date.getTime());

  return (
    <Link to={linkPath} className="cm-cal-item">
      <div className="cm-cal-date">
        {validDate ? (
          <>
            <span className="cm-cal-day">{date.getDate()}</span>
            <span className="cm-cal-weekday">
              {date.toLocaleDateString(locale, { weekday: "short" })}
            </span>
          </>
        ) : (
          <span className="cm-cal-weekday">{t("common.unknown")}</span>
        )}
      </div>

      <div className="cm-cal-thumb">
        <Poster src={item.posterUrl} title={item.title} />
      </div>

      <div className="min-w-0">
        <h3 className="cm-cal-title">{item.title}</h3>
        <div className="cm-cal-meta">
          <span className={`cm-tag${isMovie ? " cm-tag-brass" : ""}`}>
            {isMovie ? t("common.movie") : t("common.series")}
          </span>
          {item.genreArray?.length > 0 && (
            <span>{item.genreArray.join(", ")}</span>
          )}
          {isMovie && item.duration && <span>{item.duration}</span>}
          {!isMovie && item.seasons && (
            <span>
              {t("calendar.seasonCount", { count: item.seasons.length })}
            </span>
          )}
        </div>
      </div>

      <FaArrowRight className="text-muted" />
    </Link>
  );
};

export default CalendarItem;
