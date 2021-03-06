import React from 'react';
import ReactDOM from 'react-dom';
import "materialize-css/dist/css/materialize.min.css";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GlobalProvider } from "./GlobalProvider/state";
import {
  BrowserRouter

} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <GlobalProvider>
      <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
