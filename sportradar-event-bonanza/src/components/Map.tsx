import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip.jsx';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2w5aWp1MW9vMDhqNjN1dDVyejlwODVwMSJ9.XA-kvHJb1k-Lkwt53KczzQ';

const Map = () => {
  const client_identifier = 'sportradar-event-bonanza';
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap>();
  const lng = 10.75;
  const lat = 59.92;
  const zoom = 3;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const createMap = () => {
    map.current = mapContainer.current
      ? new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [lng, lat],
          zoom: zoom,
          projection: { name: 'globe' },
          logoPosition: 'bottom-right',
        })
      : undefined;
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    createMap();
  }, []);

  /*function createToolTipOnClick() {
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
        });*/
  //});
  // }
  //}, []);

  return <div ref={mapContainer} className="map-container"></div>;
};
export default Map;
