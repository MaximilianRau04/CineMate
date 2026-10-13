import { useState } from "react";
import { formatBirthday } from "../utils/useMediaDetail";
import { useTranslation } from "../../../i18n/I18nContext";

const PersonCard = ({ person, role }) => {
  const { locale } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="cm-person" title={person.biography || person.name}>
      <div className="cm-person-photo">
        {person.image && !imageFailed ? (
          <img
            src={person.image}
            alt={person.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>{person.name?.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="cm-person-name">{person.name}</div>
        <div className="cm-person-role">
          {role}
          {person.birthday && <> · {formatBirthday(person.birthday, locale)}</>}
        </div>
      </div>
    </div>
  );
};

const CastSection = ({ actors, director, castLoading }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visibleActors = showAll ? actors : actors?.slice(0, 8);

  return (
    <section className="cm-detail-section">
      <div className="cm-section-title">
        <h2>{t("cast.title")}</h2>
        {actors?.length > 0 && (
          <span className="cm-count">{actors.length + (director ? 1 : 0)}</span>
        )}
      </div>

      {castLoading ? (
        <div className="text-muted">
          <span className="spinner-border spinner-border-sm me-2" />
          {t("cast.loading")}
        </div>
      ) : !director && (!actors || actors.length === 0) ? (
        <p className="text-muted">{t("cast.empty")}</p>
      ) : (
        <>
          <div className="cm-person-grid">
            {director && (
              <PersonCard person={director} role={t("cast.director")} />
            )}
            {visibleActors?.map((actor) => (
              <PersonCard
                key={actor.id}
                person={actor}
                role={t("cast.actor")}
              />
            ))}
          </div>
          {actors?.length > 8 && (
            <button
              className="btn btn-sm btn-outline-secondary mt-3"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? t("common.showLess")
                : t("cast.showAll", { count: actors.length })}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default CastSection;
