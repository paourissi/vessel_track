import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import useVesselTrackQuery from "./services/vessel-track.query";
import { BeatLoader } from "react-spinners";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./App.css";
import { map } from "lodash/fp";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const icon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const MyMap = () => {
  const [time, setTime] = useState(0);

  const handleTimeChange = (value) => {
    setTime(value);
  };

  const { data = [], isLoading } = useVesselTrackQuery({
    period: "daily",
    days: 10,
    mmsi: 241486000,
  });

  //If we had a bigger response then we would add useMemo
  const waypoints = data.map((array, index) => ({
    position: [array.LAT, array.LON],
    time: index,
    ...array,
  }));

  //If we had a bigger response then we would add useMemo
  const visibleWaypoints = waypoints.filter(
    (waypoint) => waypoint.time <= time
  );

  //If we had a bigger response then we would add useMemo
  const bounds = L.latLngBounds(waypoints.map((waypoint) => waypoint.position));

  return (
    <>
      {isLoading ? (
        <div id="spinner">
          <BeatLoader
            color={"#36d7b7"}
            loading={true}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div style={{ margin: "20px" }}>
            <Slider
              min={0}
              max={data.length}
              step={1}
              value={time}
              onChange={handleTimeChange}
            />
          </div>
          <MapContainer
            zoom={13}
            bounds={bounds}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100wh" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={map("position", waypoints)} color="blue" />
            <MarkerClusterGroup>
              {visibleWaypoints.map((waypoint, index) => (
                <Marker
                  icon={icon}
                  key={`marker-${index}`}
                  position={waypoint.position}
                >
                  <Tooltip>
                    <ul>
                      <li>MMSI : {waypoint.MMSI}</li>
                      <li>COURSE : {waypoint.COURSE}</li>
                      <li>HEADING : {waypoint.HEADING}</li>
                      <li>SPEED : {waypoint.SPEED}</li>
                      <li>SHIP_ID : {waypoint.SHIP_ID}</li>
                    </ul>
                  </Tooltip>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </>
      )}
    </>
  );
};

export default MyMap;
