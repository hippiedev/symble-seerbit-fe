import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { store } from './redux/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <HMSRoomProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </HMSRoomProvider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorkerRegistration.unregister();
