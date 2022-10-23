import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { render } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import { Match } from '../types';
import { getMatchName } from '../utils/matchUtils';
import { flyBetweenPlacesInterval } from '../App';

interface Props {
  matches: Array<Match>;
  selectedMatch: Match;
}

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2w5aWp1MW9vMDhqNjN1dDVyejlwODVwMSJ9.XA-kvHJb1k-Lkwt53KczzQ';

const Map = ({ matches, selectedMatch }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap>();
  const startLng = 63.4329; //10.75;
  const startLat = 10.405; //59.92;
  const zoom = 5;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  let panInterval: NodeJS.Timer;
  let pulseInterval: NodeJS.Timer;
  let test = 9;
  const [mapData, setMapData] = useState<any>({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [startLat, startLng],
        },
        properties: {},
      },
    ],
  });

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
      addMapLayer(startLng, startLat, 5);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      addFirstPointToMap(
        selectedMatch.coordinates[1],
        selectedMatch.coordinates[0]
      );
      map.current?.flyTo({
        center: [selectedMatch.coordinates[1], selectedMatch.coordinates[0]],
        zoom: 5,
        bearing: 0,
        pitch: 0,
        curve: 1,
      });

      setMapData({
        ...mapData,
        features: [
          ...mapData.features,
          {
            type: 'Feature',
            geometry: {
              ...mapData.features.geometry,
              type: 'Point',
              coordinates: [
                selectedMatch.coordinates[1],
                selectedMatch.coordinates[0],
              ],
            },
            properties: {},
          },
        ],
      });
      addPointsToMap();

      setTimeout(() => {
        selectedMatch.coordinates &&
          map.current?.flyTo({
            center: [
              selectedMatch.coordinates[1],
              selectedMatch.coordinates[0],
            ],
            zoom: 12.5,
            bearing: 130,
            pitch: 75,
            speed: 2,
            curve: 1,
            easing: (t) => t,
          });
        console.log(
          getMatchName(selectedMatch),
          selectedMatch.coordinates[0],
          selectedMatch.coordinates[1]
        );
        addFirstPointToMap(
          selectedMatch.coordinates[1],
          selectedMatch.coordinates[0]
        );
      }, flyBetweenPlacesInterval / 2);
    }
  }, [selectedMatch]);

  const createToolTipOnClick = () => {
    map.current?.on('click', (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: ['eventsMapLayer'],
      });
      if (features?.length) {
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

  const addMapLayer = (lat: number, lng: number, size: number) => {
    if (map.current) {
      map.current.addSource('eventsMapLayer', {
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
      map.current &&
        map.current?.addSource('secondLayer', {
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

      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 3 });

      map.current?.addLayer({
        id: 'eventsMapLayer',
        type: 'circle',
        source: 'eventsMapLayer',
        paint: {
          'circle-color': '#fd0000',
          'circle-radius': size,
          'circle-stroke-color': '#222222',
          'circle-stroke-width': 2,
        },
      });
      map.current?.addLayer({
        id: 'secondLayer',
        type: 'circle',
        source: 'secondLayer',
        paint: {
          'circle-color': '#fdbb00',
          'circle-radius': 10,
          'circle-stroke-color': '#222222',
          'circle-stroke-width': 2,
        },
      });
    }
  };

  const addPointsToMap = () => {
    (map.current?.getSource('eventsMapLayer') as GeoJSONSource)?.setData(
      mapData
    );
  };

  const addFirstPointToMap = (lat: number, lng: number) => {
    (map.current?.getSource('secondLayer') as GeoJSONSource)?.setData({
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
    });
  };

  return <div ref={mapContainer} className="map-container" />;
};
export default Map;
