// LIBRARIES
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useMapEvents, Marker, useMap, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// COMPONENTS
import { useMapContext } from "../../context/MapProvider.tsx";
import axios from "../../api/axios";

// ICONS
import Red from "../../assets/MarkerColors/red.png";
import Green from "../../assets/MarkerColors/green.png";
import Yellow from "../../assets/MarkerColors/yellow.png";
import Blue from "../../assets/MarkerColors/blue.png";
import Cyan from "../../assets/MarkerColors/cyan.png";
import Purple from "../../assets/MarkerColors/purple.png";
import Magenta from "../../assets/MarkerColors/magenta.png";
import Default from "../../assets/MarkerColors/default.png";

const PLACE_MARKER_URL = "api-auth/markers/place-marker/";
const MARKER_LIST_URL = "api-auth/markers/marker-list/";

function LocationMarkers({ mapId }: { mapId: number }) {
  const { markers, setMarkers }: any = useMapContext();
  const { fly, setFly }: any = useMapContext();
  const mapFly = useMap();

  const flyToMarker = () => {
    if (fly.length > 1) {
      console.log(fly);
      mapFly.flyTo(fly, mapFly.getZoom());
      setFly([]);
    }
  };

  useEffect(() => {
    flyToMarker();
  }, [fly]);

  const icons: any = {
    Red: new Icon({
      iconUrl: Red,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Green: new Icon({
      iconUrl: Green,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Yellow: new Icon({
      iconUrl: Yellow,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Blue: new Icon({
      iconUrl: Blue,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Cyan: new Icon({
      iconUrl: Cyan,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Purple: new Icon({
      iconUrl: Purple,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Magenta: new Icon({
      iconUrl: Magenta,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
    Default: new Icon({
      iconUrl: Default,
      iconSize: [45, 45], // Adjust the size of the icon
      iconAnchor: [16, 32], // Adjust the anchor point if needed
      popupAnchor: [0, -32], /// point from which the popup should open relative to the iconAnchor
    }),
  };

  const getMarkers = async () => {
    let newMarkers = [];
    try {
      const response = await axios.post(
        MARKER_LIST_URL,
        JSON.stringify({
          mapId: mapId,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      for (const key in response.data) {
        newMarkers.push({
          id: key,
          name: response.data[key].name,
          desc: response.data[key].desc,
          lat: response.data[key].lat,
          long: response.data[key].long,
          address: response.data[key].address,
          folderName: response.data[key].folderPath,
          color: response.data[key].color,
        });
      }
      setMarkers(newMarkers);
    } catch (err: any) {
      if (err.response?.status === 500) {
        console.log("Something went wrong");
      } else {
        console.log("No response. Server Error");
      }
    }
  };

  useEffect(() => {
    getMarkers();
  }, []);

  // GET REQUEST FOR ADDRESS BASED ON LAT AND LONG
  const fetchAddress = async (lng: number, lat: number) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${
          import.meta.env.VITE_API_KEY
        }&types=address`
      );

      const firstFeature = response.data.features[0];
      const extractedAddress = firstFeature
        ? firstFeature.text
        : "Address not found";

      placeMarker(lat, lng, extractedAddress);
    } catch (error: any) {
      console.error("Error fetching address:", error.message);
    }
  };

  const placeMarker = async (lat: number, lng: number, address: string) => {
    try {
      const response = await axios.post(
        PLACE_MARKER_URL,
        JSON.stringify({
          lat: lat,
          long: lng,
          address: address,
          mapId: mapId,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
        
      getMarkers();
    } catch (err: any) {
      if (err.response?.status === 500) {
        toast.error("Something went wrong! Please logout and login.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 419) {
        console.log("Marker Object not Valid");
      } else if (err.response?.status === 400) {
        toast.error("Must be an Admin or a Collaborator to add markers.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const map = useMapEvents({
    click(e) {
      const { lat } = e.latlng;
      const { lng } = e.latlng;
      fetchAddress(lng, lat);
    },
  });

  const markerList = markers.map((marker: any, index: number) => (
    <Marker
      key={index}
      position={[marker.lat, marker.long]}
      icon={icons[marker.color]}
    >
      {marker.desc === "" ? (
        <Popup className="popup-style"> Add a description!</Popup>
      ) : (
        <Popup>
          {" "}
          <h6>{marker.name}</h6> <p style={{ color: "white" }}>{marker.desc}</p>
        </Popup>
      )}
    </Marker>
  ));

  return (
    <React.Fragment>
      {markerList}{" "}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </React.Fragment>
  );
}
export default LocationMarkers;
