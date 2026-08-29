import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-card">
        <div className="brand-icon">
          <Search size={30} />
        </div>

        <h1>Sistema de Cadastro</h1>

        <p>
          Realize seu cadastro ou consulte o status
          do seu cadastro de forma rápida e segura.
        </p>

        <div className="home-actions">
          <Link to="/cadastro" className="primary-button">
            <UserPlus size={20} />
            Realizar cadastro
          </Link>

          <Link to="/consulta" className="secondary-button">
            <Search size={20} />
            Consultar cadastro
          </Link>
        </div>
      </section>
    </main>
  );
}