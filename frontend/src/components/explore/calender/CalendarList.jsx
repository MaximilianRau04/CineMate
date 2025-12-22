import React from "react";
import CalendarItem from "./CalendarItem";

const CalendarList = ({ groupedContent, resetFilters }) => {
  if (Object.keys(groupedContent).length === 0) {
    return (
      <div className="text-center py-5">
        <p className="lead text-muted">Keine passenden Inhalte gefunden.</p>
        <button className="btn btn-outline-primary mt-2" onClick={resetFilters}>
          Filter zurücksetzen
        </button>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedContent).map(([month, items]) => (
        <div key={month} className="mb-4">
          <h4 className="border-bottom pb-2 mb-3">{month}</h4>
          <div className="list-group">
            {items.map((item) => (
              <CalendarItem
                key={`${item.contentType}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CalendarList;
