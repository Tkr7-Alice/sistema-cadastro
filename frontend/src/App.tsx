import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { CadastroPage } from "./pages/CadastroPage";
import { ConsultaPage } from "./pages/ConsultaPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLayout } from "./pages/AdminLayout";
import { AdminListPage } from "./pages/AdminListPage";
import { AdminDetailPage } from "./pages/AdminDetailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/consulta" element={<ConsultaPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminListPage />} />
          <Route path="pessoas/:id" element={<AdminDetailPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;