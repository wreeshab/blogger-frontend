import { lazy } from "react";
import AdminLayout from "../components/admin/AdminLayout";

const ShardingDashboard = lazy(() => import("../components/admin/ShardingDashboard"));

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "sharding", element: <ShardingDashboard /> },
      // Add more admin routes here
    ],
  },
];
