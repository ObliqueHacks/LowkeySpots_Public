import React, { createContext, useContext, useState } from "react";

interface MapContextProps {
  markers: [];
  setMarkers: React.Dispatch<React.SetStateAction<[]>>;
  fly: any;
  setFly: any;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<[]>([]);
  const [fly, setFly] = useState([]);

  return (
    <MapContext.Provider value={{ markers, setMarkers, fly, setFly }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
