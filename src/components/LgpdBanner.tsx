import React, { useState, useEffect } from 'react';

interface LgpdBannerProps {
  onOpenPrivacyPolicy: () => void;
}

const LGPD_CONSENT_KEY = 'gfrio_lgpd_consent_v1';

export const LgpdBanner: React.FC<LgpdBannerProps> = ({
  onOpenPrivacyPolicy,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(LGPD_CONSENT_KEY);
      if (!accepted) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(LGPD_CONSENT_KEY, new Date().toISOString());
    } catch {
      // Ignora erro caso armazenamento esteja restrito
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="lgpd-banner"
      role="region"
      aria-label="Aviso de privacidade e proteção de dados LGPD"
    >
      <div className="lgpd-banner__inner">
        <div className="lgpd-banner__text">
          <strong>
            <i className="bi bi-shield-check" aria-hidden="true" /> Privacidade
            e Proteção de Dados (LGPD):
          </strong>{' '}
          Utilizamos armazenamento técnico essencial para funcionamento do site
          e coletamos dados no formulário de contato exclusivamente para retorno
          comercial e orçamentos técnicos, nos termos da Lei nº 13.709/2018.
        </div>

        <div className="lgpd-banner__actions">
          <button
            type="button"
            className="lgpd-banner__policy-btn"
            onClick={onOpenPrivacyPolicy}
          >
            Política de Privacidade
          </button>
          <button
            type="button"
            className="btn-industrial btn-industrial--accent lgpd-banner__accept-btn"
            onClick={handleAccept}
          >
            <span>Concordar e Fechar</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
