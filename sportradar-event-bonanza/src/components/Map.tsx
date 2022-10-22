import React, { useRef, useEffect } from 'react';
import mapboxgl, { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { render } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import { MatchListProps } from './MatchList.js';

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2w5aWp1MW9vMDhqNjN1dDVyejlwODVwMSJ9.XA-kvHJb1k-Lkwt53KczzQ';

const flyBetweenPlacesInterval = 10000;
const Map = ({ matches }: MatchListProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap>();
  const startLng = 63.4329; //10.75;
  const startLat = 10.405; //59.92;
  const zoom = 5;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  let currentElement = 0;

  const createMap = () => {
    map.current = mapContainer.current
      ? new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
          center: [startLat, startLng],
          maxZoom: 15,
          minZoom: 0,
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
    setTimeout(() => {
      addMapLayer(startLng, startLat);
    }, 1000);
    /*addPointsToMap(10.7565162, 59.911028, '', 13);
    let stop: NodeJS.Timer;
    setTimeout(() => {
      map.current?.once('idle', () => {
        map.current?.resize();
        map.current?.zoomTo(3);
        stop = setInterval(() => {
          map.current?.panBy([0.2, 0], { duration: 1 });
        }, 1);
      });
    }, 5000);
    setTimeout(() => {
      clearInterval(stop);
    }, 20000);*/
  }, []);

  setInterval(() => {
    if (!!matches) {
      matches[currentElement].coordinates &&
        map.current?.flyTo({
          center: [
            matches[currentElement].coordinates!![1],
            matches[currentElement].coordinates!![0],
          ],
          zoom: 5,
          speed: 0.5,
          curve: 1,
          easing: (t) => t,
        });
      console.log(
        matches[currentElement].matchName,
        matches[currentElement].coordinates!![0]
      );
      addPointsToMap(
        matches[currentElement].coordinates!![0],
        matches[currentElement].coordinates!![1],
        '',
        8
      );
      currentElement = (currentElement + 1) % matches.length;
    }
  }, flyBetweenPlacesInterval);

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

  const addMapLayer = (lat: number, lng: number) => {
    map.current &&
      map.current?.addSource('eventsMapLayer', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
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
    map.current?.setTerrain({
      source: 'mapbox-dem',
      exaggeration: [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        0,
        0.2,
        7,
        1,
      ],
    });
  };

  const addPointsToMap = (
    lat: number,
    lng: number,
    icon?: string,
    zoom?: number
  ) => {
    (map.current?.getSource('eventsMapLayer') as GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          properties: {},
        },
      ],
    });
  };

  return <div ref={mapContainer} className="map-container" />;
};
export default Map;
