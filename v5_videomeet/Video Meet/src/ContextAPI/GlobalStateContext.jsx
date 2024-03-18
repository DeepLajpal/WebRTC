// GlobalStateContext.js
import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    // Initialize your global state here
    Mic: true,
    Video: true,
    viewPeople: true,
    name: "Deep Lajpal",
    profileImg: false,
    profileBackgroundColors: [
      "#AED9E0", // Soft Blue
      "#C7E5C9", // Pale Green
      "#E6E6FA", // Lavender
      "#D3D3D3", // Warm Gray
      "#F5F5DC"  // Creamy Beige
    ],
    isRemoteStreamComing:false
  });

  const updateGlobalState = (newState) => {
    setGlobalState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <GlobalStateContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
