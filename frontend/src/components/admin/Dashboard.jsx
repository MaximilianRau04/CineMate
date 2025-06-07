import React from "react";
import { FaUsers, FaFilm, FaTv, FaComments } from "react-icons/fa";

const Dashboard = ({ data }) => (
  <div className="row">
    {[
      { title: "Benutzer gesamt", count: data.users.length, color: "primary", icon: FaUsers },
      { title: "Filme gesamt", count: data.movies.length, color: "success", icon: FaFilm },
      { title: "Serien gesamt", count: data.series.length, color: "info", icon: FaTv },
      { title: "Bewertungen gesamt", count: data.reviews.length, color: "warning", icon: FaComments }
    ].map(({ title, count, color, icon: Icon }, index) => (
      <div key={index} className="col-md-3 mb-4">
        <div className={`card bg-${color} text-white`}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{count}</h4>
                <p>{title}</p>
              </div>
              <Icon size={40} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Dashboard;