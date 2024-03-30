import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './views/HomePage.jsx';
import StreamPage from './views/StreamPage.jsx';
import ErrorPage from './views/ErrorPage.jsx';
import { GlobalStateProvider } from './ContextAPI/GlobalStateContext.jsx';
import AuthPage from './views/AuthPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Home/",
    element: <HomePage />,
  },
  {
    path: "Auth/",
    element: <AuthPage />,
  },
  {
    path: "Stream/",
    element: <StreamPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  // </React.StrictMode>
)
