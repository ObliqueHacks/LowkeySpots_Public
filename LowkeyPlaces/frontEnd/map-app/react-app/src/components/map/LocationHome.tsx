import { useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
function LocationHome() {
  const [position, setPosition]: any = useState(null);
  const map = useMapEvents({
    dblclick() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
export default LocationHome;
