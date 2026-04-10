import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Listagem from './pages/Listagem';
import Formulario from './pages/Formulario';
import Detalhes from './pages/Detalhes';
import './App.css';

function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">📚</span>
        <div>
          <h1 className="navbar-title">Biblioteca</h1>
          <p className="navbar-sub">Sistema de Gestão de Livros</p>
        </div>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Acervo
        </NavLink>
        <NavLink to="/novo" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          + Novo Livro
        </NavLink>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Desenvolvido por <strong>João Otávio Zuliani Andreotti</strong> · Sistemas de Informação · 2025</p>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Listagem />} />
            <Route path="/novo" element={<Formulario />} />
            <Route path="/editar/:id" element={<Formulario />} />
            <Route path="/livro/:id" element={<Detalhes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
