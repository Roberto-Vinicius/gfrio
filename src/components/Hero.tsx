import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

export const Hero: React.FC = () => {
  const { siteData, whatsappUrl } = useSiteData();

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('servicos');
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 74,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="hero-chamber">
      <div className="hero-chamber__backdrop" aria-hidden="true" />
      <div className="hero-chamber__overlay" aria-hidden="true" />
      <div className="hero-chamber__grid-lines" aria-hidden="true" />

      <div className="hero-chamber__container">
        <div className="hero-chamber__top-grid">
          <div className="hero-chamber__panel">
            <div className="hero-chamber__tag">
              <span className="hero-chamber__pulse" aria-hidden="true" />
              Engenharia Térmica · Refrigeração Comercial e Industrial
            </div>

            <h1 className="hero-chamber__title">
              GFRIO Refrigeração Comercial
            </h1>

            <p className="hero-chamber__lead">
              Especializada na instalação, projeto executivo e manutenção de
              sistemas centrais de ar condicionado, ventilação, câmaras
              frigoríficas e refrigeração de alta disponibilidade.
            </p>

            <div className="hero-chamber__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-industrial btn-industrial--accent"
              >
                <i className="bi bi-whatsapp" aria-hidden="true" />
                <span>Solicitar Atendimento Técnico</span>
              </a>
              <a
                href="#servicos"
                onClick={scrollToServices}
                className="btn-industrial btn-industrial--ghost"
              >
                <span>Conhecer Nossos Serviços</span>
              </a>
            </div>
          </div>

          <aside
            className="hero-telemetry"
            aria-label="Parâmetros operacionais de engenharia"
          >
            <div className="hero-telemetry__header">
              <span>Parâmetros de Operação</span>
              <span className="hero-telemetry__status">
                Pronto Atendimento · RN
              </span>
            </div>

            <div className="hero-telemetry__gauges">
              <div className="hero-telemetry__gauge">
                <span className="hero-telemetry__val">-25 °C</span>
                <span className="hero-telemetry__lbl">
                  Túneis de Congelamento &amp; Câmaras
                </span>
              </div>
              <div className="hero-telemetry__gauge">
                <span className="hero-telemetry__val">VRF &amp; Chiller</span>
                <span className="hero-telemetry__lbl">
                  Centrais de Água Gelada e Climatização
                </span>
              </div>
              <div className="hero-telemetry__gauge">
                <span className="hero-telemetry__val">ISO Clean</span>
                <span className="hero-telemetry__lbl">
                  Salas Limpas e Controle Hospitalar
                </span>
              </div>
            </div>

            <div className="hero-telemetry__footer">
              <i className="bi bi-telephone-outbound" aria-hidden="true" />
              <div>
                <strong>Plantão e Orçamentos</strong>
                <span>{siteData.settings.phoneDisplay}</span>
              </div>
            </div>
          </aside>
        </div>

        <dl className="hero-chamber__specs" aria-label="Áreas de atuação técnica">
          <div className="hero-chamber__spec-item">
            <dt>Frio Alimentar e Industrial</dt>
            <dd>
              Câmaras frigoríficas, painéis de poliuretano e túneis de
              congelamento sob medida
            </dd>
          </div>
          <div className="hero-chamber__spec-item">
            <dt>Climatização de Precisão</dt>
            <dd>
              Centrais de água gelada, chillers, salas limpas e sistemas VRF de
              alta eficiência
            </dd>
          </div>
          <div className="hero-chamber__spec-item">
            <dt>Continuidade Operacional</dt>
            <dd>
              Manutenção preventiva e corretiva em racks, unidades evaporadoras
              e compressores
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
