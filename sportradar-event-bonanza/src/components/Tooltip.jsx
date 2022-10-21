import React from "react";
import "./Tooltip.css";

const Tooltip = ({
  station_name,
  num_bikes_available,
  num_docks_available,
  capacity,
}) => (
  <div>
    <h3 className="station-name"> {station_name} </h3>
    <h4 className="tooltip-info">
      Available bikes: <strong>{num_bikes_available}</strong>{" "}
    </h4>
    <h4 className="tooltip-info">
      Available parking docks:{" "}
      <strong>
        {num_docks_available}/{capacity}
      </strong>
    </h4>
  </div>
);

export default Tooltip;
