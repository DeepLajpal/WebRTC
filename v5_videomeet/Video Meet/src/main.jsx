import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './views/Home.jsx';
import UserConfig from './views/UserConfig.jsx';
import Stream from './views/Stream.jsx';
import ErrorPage from './views/ErrorPage.jsx';
import { GlobalStateProvider } from './ContextAPI/GlobalStateContext.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Home/",
    element: <Home />,
  },
  {
    path: "userConfig/",
    element: <UserConfig />,
  },
  {
    path: "Stream/",
    element: <Stream />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  </React.StrictMode>
)
