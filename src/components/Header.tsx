import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface HeaderProps {
  onOpenAdmin: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'contato', label: 'Fale Conosco' },
];

export const Header: React.FC<HeaderProps> = () => {
  const { whatsappUrl } = useSiteData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 84;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      ref={navRef}
      className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}
    >
      <div className="site-header__bar">
        <a
          href="#home"
          className="site-header__brand"
          onClick={(e) => scrollToSection(e, 'home')}
          aria-label="GFRIO Refrigeração Comercial - Início"
        >
          <img
            src="/assets/logo.jpg"
            alt="GFRIO Refrigeração Comercial"
            className="site-header__logo"
            width={108}
            height={42}
          />
          <span className="site-header__brand-divider" aria-hidden="true" />
          <span className="site-header__brand-tagline">
            Engenharia Térmica
          </span>
        </a>

        <button
          type="button"
          className={`site-header__toggle ${
            menuOpen ? 'site-header__toggle--active' : ''
          }`}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label="Alternar menu de navegação"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="site-header__toggle-bar" />
          <span className="site-header__toggle-bar" />
        </button>

        <nav
          id="primary-navigation"
          className={`site-header__nav ${
            menuOpen ? 'site-header__nav--open' : ''
          }`}
          aria-label="Navegação principal"
        >
          <ul className="site-header__links">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`site-header__link ${
                      isActive ? 'site-header__link--active' : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => scrollToSection(e, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="site-header__nav-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-industrial btn-industrial--accent site-header__cta"
            >
              <i className="bi bi-whatsapp" aria-hidden="true" />
              <span>Solicitar Orçamento</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
