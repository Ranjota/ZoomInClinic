import React, { createContext, useState } from 'react';

//Create a context
const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null, //To store user info
        appointments: [], //To store appointment data
        loading: false //To handle loading data
    });

    return (
        <GlobalStateContext.Provider value={{state, setState}}>
            {children}
        </GlobalStateContext.Provider>)
};

export {GlobalStateContext, GlobalStateProvider};