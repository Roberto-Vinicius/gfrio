import React, { useState } from 'react';
import { sendEmail, ContactFormData } from '../services/emailService';
import { useSiteData } from '../context/SiteDataContext';

interface FormContatoProps {
  onOpenPrivacyPolicy: () => void;
}

interface FormTouched {
  name: boolean;
  email: boolean;
  contato: boolean;
  mensagem: boolean;
  lgpdConsent: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMERIC_REGEX = /^[0-9]+$/;

export const FormContato: React.FC<FormContatoProps> = ({
  onOpenPrivacyPolicy,
}) => {
  const { siteData, whatsappUrl } = useSiteData();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    contato: '',
    mensagem: '',
  });
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    contato: false,
    mensagem: false,
    lgpdConsent: false,
  });

  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    name:
      formData.name.trim().length < 3
        ? 'Nome é obrigatório e deve ter no mínimo 3 caracteres.'
        : '',
    email: !EMAIL_REGEX.test(formData.email.trim())
      ? 'Insira um email válido.'
      : '',
    contato: !NUMERIC_REGEX.test(formData.contato.trim())
      ? 'O contato deve conter apenas números.'
      : '',
    mensagem:
      formData.mensagem.trim().length < 10
        ? 'Mensagem é obrigatória e deve ter no mínimo 10 caracteres.'
        : '',
    lgpdConsent: !lgpdConsent
      ? 'É necessário concordar com a Política de Privacidade (LGPD) para enviar.'
      : '',
  };

  const isFormInvalid = Boolean(
    errors.name ||
      errors.email ||
      errors.contato ||
      errors.mensagem ||
      errors.lgpdConsent
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (enviado) setEnviado(false);
    if (erroEnvio) setErroEnvio(false);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      contato: true,
      mensagem: true,
      lgpdConsent: true,
    });

    if (isFormInvalid) {
      return;
    }

    try {
      setSubmitting(true);
      await sendEmail(formData);
      setEnviado(true);
      setErroEnvio(false);
      setFormData({
        name: '',
        email: '',
        contato: '',
        mensagem: '',
      });
      setLgpdConsent(false);
      setTouched({
        name: false,
        email: false,
        contato: false,
        mensagem: false,
        lgpdConsent: false,
      });
    } catch (error) {
      console.error(error);
      setEnviado(false);
      setErroEnvio(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="section-shell">
        <div className="contact-grid">
          <div className="contact-grid__brief">
            <span className="section-kicker">Atendimento e Orçamentos</span>
            <h2 id="contact-heading" className="section-heading">
              Fale Conosco
            </h2>
            <p className="section-subheading">
              Envie os dados da sua demanda técnica ou solicite uma visita para
              avaliação de sistemas de refrigeração, câmaras frigoríficas ou
              climatização em Natal e região.
            </p>

            <dl className="contact-channels">
              <div className="contact-channels__item">
                <dt>
                  <i className="bi bi-geo-alt-fill" aria-hidden="true" /> Base
                  Operacional
                </dt>
                <dd>
                  <address className="contact-address">
                    {siteData.settings.addressLine1}
                    <br />
                    {siteData.settings.addressLine2}
                  </address>
                </dd>
              </div>
              <div className="contact-channels__item">
                <dt>
                  <i className="bi bi-whatsapp" aria-hidden="true" /> Telefone e
                  WhatsApp
                </dt>
                <dd>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteData.settings.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="contact-channels__item">
                <dt>
                  <i className="bi bi-clock-fill" aria-hidden="true" />{' '}
                  Expediente Técnico
                </dt>
                <dd>{siteData.settings.businessHours}</dd>
              </div>
              <div className="contact-channels__item">
                <dt>
                  <i className="bi bi-envelope-fill" aria-hidden="true" />{' '}
                  E-mail Corporativo
                </dt>
                <dd>
                  <a href={`mailto:${siteData.settings.email}`}>
                    {siteData.settings.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="contact-form-card">
            <form onSubmit={handleSubmit} noValidate className="contact-form">
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="name" className="contact-form__label">
                    Nome <span aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(touched.name && errors.name)}
                    aria-describedby={
                      touched.name && errors.name ? 'error-name' : undefined
                    }
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Seu nome ou empresa"
                    className={`contact-form__input ${
                      touched.name && errors.name
                        ? 'contact-form__input--error'
                        : ''
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p
                      id="error-name"
                      className="contact-form__error"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="contact-form__field">
                  <label htmlFor="email" className="contact-form__label">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(touched.email && errors.email)}
                    aria-describedby={
                      touched.email && errors.email ? 'error-email' : undefined
                    }
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="seuemail@empresa.com.br"
                    className={`contact-form__input ${
                      touched.email && errors.email
                        ? 'contact-form__input--error'
                        : ''
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p
                      id="error-email"
                      className="contact-form__error"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="contact-form__field">
                  <label htmlFor="contato" className="contact-form__label">
                    Contato (apenas números) <span aria-hidden="true">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contato"
                    name="contato"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(touched.contato && errors.contato)}
                    aria-describedby={
                      touched.contato && errors.contato
                        ? 'error-contato'
                        : undefined
                    }
                    value={formData.contato}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="84987739886"
                    className={`contact-form__input ${
                      touched.contato && errors.contato
                        ? 'contact-form__input--error'
                        : ''
                    }`}
                  />
                  {touched.contato && errors.contato && (
                    <p
                      id="error-contato"
                      className="contact-form__error"
                      role="alert"
                    >
                      {errors.contato}
                    </p>
                  )}
                </div>
              </div>

              <div className="contact-form__field">
                <label htmlFor="mensagem" className="contact-form__label">
                  Mensagem <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={5}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(touched.mensagem && errors.mensagem)}
                  aria-describedby={
                    touched.mensagem && errors.mensagem
                      ? 'error-mensagem'
                      : undefined
                  }
                  value={formData.mensagem}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Descreva o equipamento, projeto ou necessidade de manutenção"
                  className={`contact-form__textarea ${
                    touched.mensagem && errors.mensagem
                      ? 'contact-form__input--error'
                      : ''
                  }`}
                />
                {touched.mensagem && errors.mensagem && (
                  <p
                    id="error-mensagem"
                    className="contact-form__error"
                    role="alert"
                  >
                    {errors.mensagem}
                  </p>
                )}
              </div>

              <div className="contact-form__lgpd">
                <label className="contact-form__checkbox-label">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={(e) => {
                      setLgpdConsent(e.target.checked);
                      setTouched((prev) => ({ ...prev, lgpdConsent: true }));
                    }}
                    aria-required="true"
                    aria-invalid={Boolean(
                      touched.lgpdConsent && errors.lgpdConsent
                    )}
                  />
                  <span>
                    Autorizo o uso dos dados informados exclusivamente para
                    retorno comercial e atendimento técnico da GFRIO, em
                    conformidade com a{' '}
                    <button
                      type="button"
                      className="contact-form__policy-link"
                      onClick={onOpenPrivacyPolicy}
                    >
                      Política de Privacidade e LGPD (Lei nº 13.709/2018)
                    </button>
                    .
                  </span>
                </label>
                {touched.lgpdConsent && errors.lgpdConsent && (
                  <p className="contact-form__error" role="alert">
                    {errors.lgpdConsent}
                  </p>
                )}
              </div>

              <div className="contact-form__submit">
                <button
                  type="submit"
                  className="btn-industrial btn-industrial--primary contact-form__btn"
                  disabled={isFormInvalid || submitting}
                >
                  <i className="bi bi-send-fill" aria-hidden="true" />
                  <span>
                    {submitting
                      ? 'Enviando solicitação...'
                      : 'Enviar Solicitação por E-mail'}
                  </span>
                </button>
              </div>

              {enviado && (
                <div
                  className="contact-alert contact-alert--success"
                  role="status"
                >
                  E-mail enviado com sucesso! Nossa equipe retornará em breve.
                </div>
              )}

              {erroEnvio && (
                <div
                  className="contact-alert contact-alert--danger"
                  role="alert"
                >
                  Não foi possível enviar pelo servidor no momento. Verifique se
                  o serviço de e-mail está ativo na porta 3001 ou fale conosco
                  diretamente pelo WhatsApp ({siteData.settings.phoneDisplay}).
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
