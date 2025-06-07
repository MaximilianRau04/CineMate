import React from "react";
import { FaPlus } from "react-icons/fa";
import ContentTable from "../ContentTable";

/**
 * Main content management component
 */
const ContentManagement = ({ data, onAdd, onEdit, onDelete, onSeriesSeasons }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Content Management</h4>
      <button className="btn btn-primary" onClick={onAdd}>
        <FaPlus /> Inhalt hinzufügen
      </button>
    </div>

    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5>Filme</h5>
          </div>
          <div className="card-body">
            <ContentTable
              items={data.movies}
              type="movie"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Serien</h5>
          </div>
          <div className="card-body">
            <ContentTable
              items={data.series}
              type="series"
              onEdit={onEdit}
              onDelete={onDelete}
              onSeriesSeasons={onSeriesSeasons}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContentManagement;