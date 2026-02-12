import { useContext, useState } from "react";
import { createContext } from "react";
const latAndLonContext = createContext();

export const useLatAndLonContext = () => {
  return useContext(latAndLonContext);
};

export const LatAndLonProvider = ({ children }) => {
  const [latAndLon, setLatAndLon] = useState({
    lat: 30.033333,
    lon: 31.233334,
  });

  return (
    <latAndLonContext.Provider value={{ latAndLon, setLatAndLon }}>
      {children}
    </latAndLonContext.Provider>
  );
};
