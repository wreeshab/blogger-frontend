import { useAuth } from "@/lib/auth";
import { Link, Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  // TODO: Replace with real admin role check if available
  const isAdmin = isAuthenticated; // Replace with role check if you store roles
  if (!isAdmin) return <Navigate to="/login" replace />;
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Panel</h1>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/admin/sharding" style={{ marginRight: 16 }}>Sharding Dashboard</Link>
        {/* Add more admin links here */}
      </nav>
      <Outlet />
    </div>
  );
}
