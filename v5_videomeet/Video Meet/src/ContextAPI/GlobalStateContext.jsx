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
    remoteVideo:false,
    remoteAudio:false,
    existingUsers:3
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
