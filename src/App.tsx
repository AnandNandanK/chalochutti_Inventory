// App.tsx - Updated Routes
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "@/pages/inventory/Layout";
import PortalLayout from "@/layouts/PortalLayout";
import Dashboard from "@/components/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      
      // ✅ Inventory routes with specific views
      { 
        path: "inventory", 
        element: <Navigate to="inventory/room-types" replace /> 
      },
      { 
        path: "inventory/room-types", 
        element: <Layout /> 
      },
      { 
        path: "inventory/rate-plans", 
        element: <Layout /> 
      },
 
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;