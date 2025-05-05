import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import ETUDIANT from "../layout/ETUDIANT";
import ADMINISTRATEURDECLUB from "../layout/ADMINISTRATEURDECLUB";
import ADMINISTRATEURSYSTEME from "../layout/ADMINISTRATEURSYSTEME";
import Gist from "../layout/Gist";

// Fonction fictive d'authentification (utilise localStorage)
const getUserRole = () => localStorage.getItem("role");

const ProtectedRoute = ({ role, children }) => {
  const currentRole = getUserRole();
  return currentRole === role ? children : <p>⛔ Accès refusé</p>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "etudiant",
        element: (
          <ProtectedRoute role="etudiant">
            <ETUDIANT />
          </ProtectedRoute>
        ),
      },
      {
        path: "adminclub",
        element: (
          <ProtectedRoute role="adminclub">
            <ADMINISTRATEURDECLUB />
          </ProtectedRoute>
        ),
      },
      {
        path: "adminsysteme",
        element: (
          <ProtectedRoute role="adminsysteme">
            <ADMINISTRATEURSYSTEME />
          </ProtectedRoute>
        ),
      },
      {
        path: "gist",
        element: <Gist />,
      },
    ],
  },
]);
