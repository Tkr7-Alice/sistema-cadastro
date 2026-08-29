import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, Users, LayoutDashboard } from "lucide-react";
import { isAuthenticated, getAdmin, logout } from "../lib/auth";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <LayoutDashboard size={22} />
          <span>Painel Admin</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin"
            className={`sidebar-link${
              location.pathname === "/admin" || location.pathname.startsWith("/admin/pessoas")
                ? " active"
                : ""
            }`}
          >
            <Users size={18} />
            Cadastros
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <span className="admin-name">{admin?.nome || "Admin"}</span>
            <span className="admin-email">{admin?.email || ""}</span>
          </div>

          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
