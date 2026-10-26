import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SiteDataProvider } from './context/SiteDataContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Servicos } from './components/Servicos';
import { Sobre } from './components/Sobre';
import { Clientes } from './components/Clientes';
import { FormContato } from './components/FormContato';
import { Footer } from './components/Footer';
import { LgpdBanner } from './components/LgpdBanner';

const AdminPanel = lazy(() =>
  import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const PrivacyModal = lazy(() =>
  import('./components/PrivacyModal').then((m) => ({ default: m.PrivacyModal }))
);

export const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin'
    );
  });

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(
        window.location.pathname === '/admin' ||
          window.location.hash === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const openAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdmin = () => {
    if (window.location.hash === '#admin') {
      window.history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search
      );
    } else if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SiteDataProvider>
      {isAdminRoute ? (
        <Suspense
          fallback={
            <div className="admin-loading" role="status">
              Carregando Painel de Administração...
            </div>
          }
        >
          <AdminPanel onExitAdmin={exitAdmin} />
        </Suspense>
      ) : (
        <div className="app-shell">
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Header onOpenAdmin={openAdmin} />
          <main id="main-content" className="app-main" tabIndex={-1}>
            <Hero />
            <Servicos />
            <Sobre />
            <Clientes />
            <FormContato
              onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
            />
          </main>
          <Footer
            onOpenAdmin={openAdmin}
            onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
          />
          <LgpdBanner onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)} />
          {isPrivacyOpen && (
            <Suspense fallback={null}>
              <PrivacyModal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
              />
            </Suspense>
          )}
        </div>
      )}
    </SiteDataProvider>
  );
};

export default App;
