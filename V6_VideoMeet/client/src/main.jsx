import 'global';
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './views/HomePage.jsx';
import MeetingPage from './views/MeetingPage.jsx';
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
    path: "home/",
    element: <HomePage />,
  },
  {
    path: "auth/",
    element: <AuthPage />,
  },
  {
    path: "meeting/:meetingId/:participantId",
    element: <MeetingPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  // </React.StrictMode>
)
