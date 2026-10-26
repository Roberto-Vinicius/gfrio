import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export const Servicos: React.FC = () => {
  const { siteData, whatsappUrl } = useSiteData();

  return (
    <section
      id="servicos"
      className="services-section"
      aria-labelledby="services-heading"
    >
      <div className="section-shell">
        <div className="services-section__header">
          <div>
            <span className="section-kicker">Engenharia e Manutenção</span>
            <h2 id="services-heading" className="section-heading">
              Nossos Serviços
            </h2>
            <p className="section-subheading">
              Atuação completa desde o dimensionamento térmico e projeto
              executivo até a manutenção de sistemas críticos de refrigeração
              comercial, industrial e hospitalar.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-industrial btn-industrial--primary"
          >
            <i className="bi bi-whatsapp" aria-hidden="true" />
            <span>Solicitar Orçamento</span>
          </a>
        </div>

        <div className="services-matrix">
          {siteData.services.map((service) => (
            <article key={service.id} className="service-module">
              <div className="service-module__media">
                <img
                  src={service.image}
                  alt={service.imageAlt || service.title}
                  className="service-module__img"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={230}
                />
                {service.badge && (
                  <span className="service-module__badge">{service.badge}</span>
                )}
              </div>

              <div className="service-module__body">
                <header className="service-module__header">
                  <h3 className="service-module__title">{service.title}</h3>
                  {service.subtitle && (
                    <p className="service-module__subtitle">
                      {service.subtitle}
                    </p>
                  )}
                </header>

                <ul className="service-module__list">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="service-module__item">
                      <span
                        className="service-module__marker"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-module__footer">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-module__cta"
                  >
                    <span>Consultar disponibilidade técnica</span>
                    <i className="bi bi-arrow-up-right" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
