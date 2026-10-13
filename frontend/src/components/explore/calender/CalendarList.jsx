import React from "react";
import CalendarItem from "./CalendarItem";
import { useTranslation } from "../../../i18n/I18nContext";

const CalendarList = ({ groupedContent, resetFilters }) => {
  const { t } = useTranslation();

  if (Object.keys(groupedContent).length === 0) {
    return (
      <div className="cm-empty">
        <h3>{t("calendar.empty")}</h3>
        <p>{t("calendar.emptyHint")}</p>
        <button className="btn btn-outline-primary" onClick={resetFilters}>
          {t("explore.resetFilters")}
        </button>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedContent).map(([month, items]) => (
        <section key={month} className="cm-cal-month">
          <h2>{month}</h2>
          <div className="cm-cal-list">
            {items.map((item) => (
              <CalendarItem
                key={`${item.contentType}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default CalendarList;
