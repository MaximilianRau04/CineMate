
const AssignmentForm = ({ 
  contentType, 
  setContentType, 
  selectedContent, 
  setSelectedContent,
  contents 
}) => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Medientyp</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="contentType"
              id="movieType"
              value="movie"
              checked={contentType === 'movie'}
              onChange={() => setContentType('movie')}
            />
            <label className="form-check-label" htmlFor="movieType">Film</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="contentType"
              id="seriesType"
              value="series"
              checked={contentType === 'series'}
              onChange={() => setContentType('series')}
            />
            <label className="form-check-label" htmlFor="seriesType">Serie</label>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">
          {contentType === 'movie' ? 'Film auswählen' : 'Serie auswählen'}
        </label>
        <select
          className="form-control"
          value={selectedContent?.id || ''}
          onChange={(e) => {
            const id = e.target.value;
            const content = contents.find(item => item.id === id);
            setSelectedContent(content);
          }}
        >
          <option value="">Bitte auswählen</option>
          {contents.map(item => (
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