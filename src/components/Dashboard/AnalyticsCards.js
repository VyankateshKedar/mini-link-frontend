import React from "react";
import "./AnalyticsCards.css";

const AnalyticsCards = ({ data }) => {
  const { totalClicks, dateWiseClicks, clickDevices } = data;

  return (
    <div className="analytics-cards">
      <div className="card">
        <h3>Total Clicks</h3>
        <h2>{totalClicks}</h2>
      </div>
      <div className="card">
        <h3>Date-wise Clicks</h3>
        <ul>
          {dateWiseClicks.map((click, index) => (
            <li key={index}>
              {click.date} - {click.clicks}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Click Devices</h3>
        <ul>
          {Object.entries(clickDevices).map(([device, count], index) => (
            <li key={index}>
              {device} - {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsCards;
