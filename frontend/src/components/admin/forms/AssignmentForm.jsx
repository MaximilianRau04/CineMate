import { useTranslation } from "../../../i18n/I18nContext";
const AssignmentForm = ({
  contentType,
  setContentType,
  selectedContent,
  setSelectedContent,
  contents,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-3">
        <label className="form-label">{t("admin.fields.mediaType")}</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="contentType"
              id="movieType"
              value="movie"
              checked={contentType === "movie"}
              onChange={() => setContentType("movie")}
            />
            <label className="form-check-label" htmlFor="movieType">
              {t("common.movie")}
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="contentType"
              id="seriesType"
              value="series"
              checked={contentType === "series"}
              onChange={() => setContentType("series")}
            />
            <label className="form-check-label" htmlFor="seriesType">
              {t("common.series")}
            </label>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">
          {contentType === "movie"
            ? t("admin.fields.selectMovie")
            : t("admin.fields.selectSeries")}
        </label>
        <select
          className="form-select"
          value={selectedContent?.id || ""}
          onChange={(e) => {
            const id = e.target.value;
            const content = contents.find((item) => item.id === id);
            setSelectedContent(content);
          }}
        >
          <option value="">{t("admin.fields.pleaseSelect")}</option>
          {contents.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default AssignmentForm;
