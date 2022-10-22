import React, { useRef, useEffect } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { render } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2w5aWp1MW9vMDhqNjN1dDVyejlwODVwMSJ9.XA-kvHJb1k-Lkwt53KczzQ';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap>();
  const lng = 0; //10.75;
  const lat = 30; //59.92;
  const zoom = 3;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const createMap = () => {
    map.current = mapContainer.current
      ? new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
          center: [lng, lat],
          maxZoom: 15,
          minZoom: 3,
          zoom: zoom,
          projection: { name: 'globe' },
          logoPosition: 'bottom-right',
        })
      : undefined;
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    createMap();
    createToolTipOnClick();
    addPointsToMap(10.7565162, 59.911028, '', 13);
    let stop: any;
    setTimeout(() => {
      map.current?.once('idle', () => {
        map.current?.resize();
        map.current?.setZoom(3);
        stop = setInterval(() => {
          map.current?.panBy([0.2, 0], { duration: 1 });
        }, 1);
      });
    }, 5000);
    setTimeout(() => {
      clearInterval(stop);
    }, 20000);
  }, []);

  // setInterval(() => {
  // map.current?.panBy([0.2, 0], { duration: 0.5 });
  // }, 1);

  const createToolTipOnClick = () => {
    map.current?.on('click', (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: ['eventsMapLayer'],
      });
      if (features?.length) {
        /*const feature = features[0];
          const currentStationStatus = stationsStatus.find(
            (station) => station.station_id === feature.properties.station_id
          );
          const currentStationInfo = stations.find(
            (s) => s.station_id === feature.properties.station_id
          );*/
        const popupNode = document.createElement('div');
        render(<Tooltip />, popupNode);
        map.current &&
          popUpRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(map.current);
      }
    });
  };

  const addPointsToMap = (
    lat: number,
    lng: number,
    icon?: string,
    zoom?: number
  ) => {
    map.current &&
      map.current.on('load', () => {
        map.current?.addSource('eventsMapLayer', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [lat, lng],
                },
                properties: {},
              },
            ],
          },
        });
        map.current?.addLayer({
          id: 'eventsMapLayer',
          type: 'circle',
          source: 'eventsMapLayer',
          paint: {
            'circle-color': '#fd0000',
            'circle-radius': 8,
            'circle-stroke-color': '#222222',
            'circle-stroke-width': 2,
          },
        });
        // sleep 3 secs
        setTimeout(() => {
          map.current?.flyTo({
            center: [lat, lng],
            zoom: zoom || 3,
            duration: 5000,
          });
        }, 3000);
      });
  };

  return <div ref={mapContainer} className="map-container"></div>;
};
export default Map;
