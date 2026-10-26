import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenPrivacyPolicy,
}) => {
  const { siteData, whatsappUrl } = useSiteData();
  const { settings } = siteData;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="section-shell">
        <div className="site-footer__grid">
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Endereço</h3>
            <address className="site-footer__text contact-address">
              {settings.addressLine1}
              <br />
              {settings.addressLine2}
            </address>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-industrial btn-industrial--ghost site-footer__map-btn"
            >
              <i className="bi bi-geo-alt" aria-hidden="true" />
              <span>Como chegar até nós</span>
            </a>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Horário e Atendimento</h3>
            <p className="site-footer__text">{settings.businessHours}</p>
            <p className="site-footer__text">
              <strong>Telefone / WhatsApp:</strong> {settings.phoneDisplay}
              <br />
              <strong>E-mail:</strong> {settings.email}
            </p>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Redes Sociais e Contato</h3>
            <ul className="site-footer__socials" aria-label="Redes sociais">
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                  aria-label="Instagram GFRIO Oficial"
                >
                  <i className="bi bi-instagram" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                  aria-label="Localização no Google Maps"
                >
                  <i className="bi bi-geo-alt" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                  aria-label="WhatsApp GFRIO"
                >
                  <i className="bi bi-whatsapp" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="site-footer__social-link"
                  aria-label={`E-mail ${settings.email}`}
                >
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            Gfrio - O melhor para seu negócio,{' '}
            <span>&copy; Todos os direitos reservados.</span>
          </p>
          <div className="site-footer__bottom-right">
            <button
              type="button"
              className="site-footer__policy-link"
              onClick={onOpenPrivacyPolicy}
            >
              <i className="bi bi-shield-check" aria-hidden="true" /> Política
              de Privacidade e LGPD
            </button>

            <span>
              Desenvolvido por{' '}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Roberto Vinicius
              </a>
            </span>

            <button
              type="button"
              className="site-footer__admin-link"
              onClick={onOpenAdmin}
            >
              <i className="bi bi-shield-lock" aria-hidden="true" /> Painel
              Administrador
            </button>
          </div>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Falar com a GFRIO pelo WhatsApp"
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
        <span>Orçamento Rápido</span>
      </a>
    </footer>
  );
};
