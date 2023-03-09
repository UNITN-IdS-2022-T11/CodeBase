import { useRef, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

export default function Map() {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 46.06683854256024,
    longitude: 11.150593269314516,
    zoom: 10,
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="250px"
      mapboxApiAccessToken="pk.eyJ1IjoibWluaW1pMTciLCJhIjoiY2xjN3Z0bmVqMDJuODNvcjUwMzYyMW13NCJ9.yVhIb28LLG1mnMvD1jcyHw"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      ref={(instance) => (mapRef.current = instance)}
      minZoom={5}
      maxZoom={15}
      mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
    >
      {" "}
      {[{ center: [11.150062147133534, 46.068990279231414] }].map(
        (location) => (
          <div key={location.id}>
            <Marker
              latitude={location.center[1]}
              longitude={location.center[0]}
            >
              <span role="img" aria-label="push-pin">
                📌
              </span>
            </Marker>
          </div>
        )
      )}
    </ReactMapGL>
  );
}
