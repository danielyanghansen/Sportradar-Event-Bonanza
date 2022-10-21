import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./Map.css";
import ReactDOM from "react-dom";
import Tooltip from "./Tooltip.jsx";

mapboxgl.accessToken =
  "pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2w5aWp1MW9vMDhqNjN1dDVyejlwODVwMSJ9.XA-kvHJb1k-Lkwt53KczzQ";

const Map = () => {
  const client_identifier = "sportradar-event-bonanza";
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 10.75;
  const lat = 59.92;
  const zoom = 1;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const [stations, setStations] = useState();
  const [stationsStatus, setStationsStatus] = useState();

  const fetchStations = async (url, setter) => {
    return fetch(url, {
      headers: {
        "Client-Identifier": { client_identifier },
      },
    })
      .then((res) => res.json())
      .then((json) => setter(json.data.stations));
  };

  useEffect(() => {
    fetchStations(
      "https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json",
      setStations
    );
    fetchStations(
      "https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json",
      setStationsStatus
    );
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!stations || !stationsStatus) return;

    createMap();
    createToolTipOnClick();

    const stationsGeoJSONArray = stations.map((station) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [station.lon, station.lat],
        },
        properties: { station_id: station.station_id },
      };
    });

    const stationsCollection = {
      type: "FeatureCollection",
      features: stationsGeoJSONArray,
    };
    addPointsToMap();

    function createMap() {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [lng, lat],
            zoom: zoom,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });
    }

    function createToolTipOnClick() {
      map.current.on("click", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["stationsMapLayer"],
        });
        if (features.length) {
          const feature = features[0];
          const currentStationStatus = stationsStatus.find(
            (station) => station.station_id === feature.properties.station_id
          );
          const currentStationInfo = stations.find(
            (s) => s.station_id === feature.properties.station_id
          );
          const popupNode = document.createElement("div");
          ReactDOM.render(
            <Tooltip
              station_name={currentStationInfo.name}
              num_bikes_available={currentStationStatus.num_bikes_available}
              num_docks_available={currentStationStatus.num_docks_available}
              capacity={currentStationInfo.capacity}
            />,
            popupNode
          );
          popUpRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(map.current);
        }
      });
    }

    function addPointsToMap() {
      map.current.on("load", () => {
        map.current.addSource("stationsMapLayer", {
          type: "geojson",
          data: stationsCollection,
        });
        map.current.addLayer({
          id: "stationsMapLayer",
          type: "circle",
          source: "stationsMapLayer",
          paint: {
            "circle-color": "#11aa22",
            "circle-radius": 8,
            "circle-stroke-color": "#222222",
            "circle-stroke-width": 2,
          },
        });
      });
    }
  }, [stations, stationsStatus]);

  return <div ref={mapContainer} className="map-container"></div>;
};
export default Map;
