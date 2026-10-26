import React, { useState, useEffect, useCallback } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export const Clientes: React.FC = () => {
  const { siteData } = useSiteData();
  const clientes = siteData.clients;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex =
    clientes.length > 0 ? activeIndex % clientes.length : 0;

  const nextSlide = useCallback(() => {
    if (clientes.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % clientes.length);
  }, [clientes.length]);

  const prevSlide = useCallback(() => {
    if (clientes.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + clientes.length) % clientes.length);
  }, [clientes.length]);

  useEffect(() => {
    if (isPaused || clientes.length <= 1) return;
    const timer = window.setInterval(nextSlide, 3500);
    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide, clientes.length]);

  if (clientes.length === 0) {
    return null;
  }

  const activeClient = clientes[safeIndex];

  return (
    <section
      id="clientes"
      className="clients-section"
      aria-labelledby="clients-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-shell">
        <div className="clients-section__header">
          <div>
            <span className="section-kicker">Parcerias de Confiança</span>
            <h2 id="clients-heading" className="section-heading">
              Nossos Clientes
            </h2>
            <p className="section-subheading">
              Grandes redes de atacado, indústria alimentícia, ensino e
              gastronomia que confiam sua operação térmica à GFRIO.
            </p>
          </div>

          <div
            className="clients-section__controls"
            aria-label="Controles do carrossel"
          >
            <button
              type="button"
              className="clients-control-btn"
              onClick={prevSlide}
              aria-label="Cliente anterior"
            >
              <i className="bi bi-arrow-left" aria-hidden="true" />
            </button>
            <span className="clients-control-counter" aria-live="polite">
              {safeIndex + 1} / {clientes.length}
            </span>
            <button
              type="button"
              className="clients-control-btn"
              onClick={nextSlide}
              aria-label="Próximo cliente"
            >
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="clients-showcase">
          <div
            className="clients-showcase__stage"
            role="region"
            aria-live="polite"
            aria-label="Cliente em destaque"
          >
            <span className="clients-showcase__eyebrow">
              Operação Atendida pela GFRIO
            </span>
            <div className="clients-showcase__logo-box">
              <img
                src={activeClient.imagem}
                alt={activeClient.titulo}
                className="clients-showcase__logo"
                decoding="async"
                width={240}
                height={140}
              />
            </div>
            <div className="clients-showcase__meta">
              <h3 className="clients-showcase__name">{activeClient.titulo}</h3>
              {activeClient.descricao && (
                <p className="clients-showcase__unit">
                  {activeClient.descricao}
                </p>
              )}
            </div>
          </div>

          <div
            className="clients-roster"
            role="tablist"
            aria-label="Lista de clientes"
          >
            {clientes.map((cliente, index) => {
              const isSelected = index === safeIndex;
              return (
                <button
                  key={cliente.id || cliente.titulo}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`clients-roster__item ${
                    isSelected ? 'clients-roster__item--active' : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={cliente.imagem}
                    alt={cliente.titulo}
                    className="clients-roster__thumb"
                    loading="lazy"
                    decoding="async"
                    width={58}
                    height={46}
                  />
                  <div className="clients-roster__info">
                    <span className="clients-roster__title">
                      {cliente.titulo}
                    </span>
                    {cliente.descricao && (
                      <span className="clients-roster__desc">
                        {cliente.descricao}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
