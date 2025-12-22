import { formatBirthday } from "../utils/useMediaDetail";

const CastSection = ({ actors, director, castLoading }) => {
  return (
    <div className="mb-4 text-white">
      <h5>🎬 Besetzung & Crew</h5>

      {castLoading ? (
        <div className="text-center py-3">
          <div
            className="spinner-border spinner-border-sm text-secondary"
            role="status"
          />
          <span className="ms-2 text-muted">Besetzung wird geladen...</span>
        </div>
      ) : (
        <>
          {/* Director Section */}
          {director && (
            <div
              className="mb-3"
              style={{ width: "fit-content", minWidth: "50%" }}
            >
              <h6 className="text-primary mb-2" style={{ fontSize: "1rem" }}>
                🎯 Regisseur
              </h6>
              <div className="card border-0 shadow-sm">
                <div className="row g-0">
                  <div
                    className="col-md-2"
                    style={{ minWidth: "80px", maxWidth: "80px" }}
                  >
                    <img
                      src={director.image}
                      alt={director.name}
                      className="rounded-start"
                      style={{
                        height: "80px",
                        width: "80px",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=Kein+Bild";
                      }}
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="card-body py-2 px-3">
                      <h6
                        className="card-title mb-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {director.name}
                      </h6>
                      {director.birthday && (
                        <small className="text-muted">
                          Geboren: {formatBirthday(director.birthday)}
                        </small>
                      )}
                      {director.biography && (
                        <p
                          className="card-text mt-1 mb-0"
                          style={{ fontSize: "0.8rem", lineHeight: "1.3" }}
                        >
                          {director.biography.length > 120
                            ? `${director.biography.substring(0, 120)}...`
                            : director.biography}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actors Section */}
          {actors && actors.length > 0 && (
            <div className="mb-3">
              <h6 className="text-primary mb-2" style={{ fontSize: "1rem" }}>
                🎭 Schauspieler ({actors.length})
              </h6>
              <div className="row">
                {actors.slice(0, 6).map((actor) => (
                  <div
                    key={actor.id}
                    className="col-md-6 mb-2"
                    style={{ width: "fit-content", minWidth: "25%" }}
                  >
                    <div className="card border-0 shadow-sm h-100">
                      <div className="row g-0 h-100">
                        <div
                          className="col-3"
                          style={{ minWidth: "60px", maxWidth: "60px" }}
                        >
                          <img
                            src={actor.image}
                            alt={actor.name}
                            className="rounded-start"
                            style={{
                              height: "70px",
                              width: "60px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/60x70?text=Kein+Bild";
                            }}
                          />
                        </div>
                        <div className="col-9">
                          <div className="card-body py-2 px-2">
                            <h6
                              className="card-title mb-1"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {actor.name}
                            </h6>
                            {actor.birthday && (
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {formatBirthday(actor.birthday)}
                              </small>
                            )}
                            {actor.biography && (
                              <p
                                className="card-text mt-1 mb-0"
                                style={{
                                  fontSize: "0.7rem",
                                  lineHeight: "1.2",
                                }}
                              >
                                {actor.biography.length > 60
                                  ? `${actor.biography.substring(0, 60)}...`
                                  : actor.biography}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {actors.length > 6 && (
                <div className="text-center">
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    und {actors.length - 6} weitere Schauspieler...
                  </small>
                </div>
              )}
            </div>
          )}

          {!director && (!actors || actors.length === 0) && (
            <div className="text-center py-3">
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Keine Informationen über Besetzung und Crew verfügbar.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CastSection;
