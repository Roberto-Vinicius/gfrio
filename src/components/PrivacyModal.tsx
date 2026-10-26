import React, { useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { siteData } = useSiteData();
  const { settings } = siteData;
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="privacy-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="privacy-modal">
        <header className="privacy-modal__header">
          <div>
            <span className="section-kicker">Conformidade Legal · LGPD</span>
            <h2 id="privacy-modal-title" className="privacy-modal__title">
              Política de Privacidade e Coleta de Dados
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="privacy-modal__close"
            onClick={onClose}
            aria-label="Fechar Política de Privacidade"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <div className="privacy-modal__body">
          <p className="privacy-modal__intro">
            A <strong>GFRIO Refrigeração Comercial</strong> respeita a sua
            privacidade e atua em estrita conformidade com a{' '}
            <strong>
              Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº
              13.709/2018)
            </strong>
            . Este documento explica de forma clara e transparente como
            coletamos, utilizamos, armazenamos e protegemos os seus dados.
          </p>

          <section className="privacy-modal__section">
            <h3>1. Controlador dos Dados</h3>
            <p>
              O tratamento dos dados pessoais coletados neste site é realizado
              pela <strong>GFRIO Refrigeração Comercial</strong>, com base
              operacional em {settings.addressLine1}, {settings.addressLine2},
              e-mail de contato{' '}
              <a href={`mailto:${settings.email}`}>{settings.email}</a> e
              telefone {settings.phoneDisplay}.
            </p>
          </section>

          <section className="privacy-modal__section">
            <h3>2. Dados Pessoais Coletados</h3>
            <p>
              Coletamos exclusivamente os dados fornecidos de forma voluntária e
              direta pelo titular ao preencher o formulário{' '}
              <strong>Fale Conosco</strong> ou iniciar atendimento técnico via
              WhatsApp:
            </p>
            <ul>
              <li>
                <strong>Nome ou razão social:</strong> para identificação do
                solicitante;
              </li>
              <li>
                <strong>Endereço de e-mail:</strong> para envio de respostas,
                propostas técnicas e orçamentos;
              </li>
              <li>
                <strong>Número de telefone / WhatsApp:</strong> para contato
                direto da equipe de engenharia e agendamento de visitas
                técnicas;
              </li>
              <li>
                <strong>Mensagem descritiva:</strong> informações sobre a
                demanda de refrigeração, climatização ou manutenção.
              </li>
            </ul>
          </section>

          <section className="privacy-modal__section">
            <h3>3. Finalidade e Base Legal do Tratamento (Art. 7º da LGPD)</h3>
            <p>
              Os dados coletados são utilizados <strong>unicamente</strong>{' '}
              para:
            </p>
            <ul>
              <li>
                Responder às solicitações de orçamento, consultoria e suporte
                técnico enviadas pelo titular (
                <em>
                  Art. 7º, V — procedimentos preliminares relacionados a
                  contrato do qual seja parte o titular
                </em>
                );
              </li>
              <li>
                Comunicação direta solicitada mediante consentimento expresso do
                usuário no momento do envio do formulário (
                <em>Art. 7º, I — mediante o fornecimento de consentimento</em>).
              </li>
            </ul>
            <p>
              <strong>Não comercializamos, alugamos ou compartilhamos</strong>{' '}
              seus dados pessoais com terceiros para fins publicitários.
            </p>
          </section>

          <section className="privacy-modal__section">
            <h3>4. Armazenamento Local e Cookies Essenciais</h3>
            <p>
              Este site utiliza apenas armazenamento técnico essencial no
              navegador (<code>localStorage</code>) para registrar a sua
              ciência quanto a este aviso de privacidade e manter a performance
              da interface. Não utilizamos cookies de rastreamento invasivo de
              terceiros.
            </p>
          </section>

          <section className="privacy-modal__section">
            <h3>5. Direitos do Titular dos Dados (Art. 18 da LGPD)</h3>
            <p>
              A qualquer momento, de forma gratuita, você pode solicitar à
              GFRIO:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento e acesso aos dados;</li>
              <li>
                Correção de dados incompletos, inexatos ou desatualizados;
              </li>
              <li>
                Anonimização, bloqueio ou eliminação de dados desnecessários ou
                tratados mediante consentimento;
              </li>
              <li>Revogação do consentimento previamente concedido.</li>
            </ul>
          </section>

          <section className="privacy-modal__section">
            <h3>6. Canal de Atendimento à Privacidade (Encarregado / DPO)</h3>
            <p>
              Para exercer seus direitos previstos na LGPD ou esclarecer dúvidas
              sobre o tratamento de dados pessoais, entre em contato pelo
              e-mail{' '}
              <a href={`mailto:${settings.email}`}>{settings.email}</a> ou pelo
              telefone {settings.phoneDisplay}.
            </p>
          </section>
        </div>

        <footer className="privacy-modal__footer">
          <span>Última atualização: Outubro de 2026 · Lei nº 13.709/2018</span>
          <button
            type="button"
            className="btn-industrial btn-industrial--primary"
            onClick={onClose}
          >
            <span>Entendi e Fechar</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
