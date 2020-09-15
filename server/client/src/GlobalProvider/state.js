import React, { createContext, useReducer } from 'react';
import appReducer from './Reducer';

export const globalContext = createContext();

const InitialState = {
    user:""
}
export const GlobalProvider = ({ children }) => {

    const [state, dispatch] = useReducer(appReducer, InitialState);

    function addUser(user) {
        dispatch({
            type: "Add_user",
            payload: user
        });
    }
    const clearUser = () => {
        dispatch({
            type: "clear_user",
            payload:"",
        });
    };
    return (<globalContext.Provider value={{
        user:state.user,
        addUser,
        clearUser,
    }} >
        {children}
    </globalContext.Provider>
    );
}