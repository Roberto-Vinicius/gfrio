import React, { useState, useEffect } from 'react';
import {
  useSiteData,
  CompanySettings,
  ServiceItem,
  ClientItem,
} from '../context/SiteDataContext';
import {
  fetchAllMessages,
  deleteStoredMessage,
  StoredMessage,
} from '../services/emailService';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

type AdminTab = 'settings' | 'services' | 'clients' | 'messages';

const AUTH_SESSION_KEY = 'gfrio_admin_authenticated';
const ADMIN_PASSWORD_KEY = 'gfrio_admin_password';
const DEFAULT_ADMIN_PASSWORD = 'gfrio2026';

function getStoredPassword(): string {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const {
    siteData,
    updateSettings,
    addService,
    updateService,
    deleteService,
    addClient,
    updateClient,
    deleteClient,
    resetToDefaults,
  } = useSiteData();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Change password state inside settings
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<CompanySettings>(
    siteData.settings
  );

  useEffect(() => {
    setSettingsForm(siteData.settings);
  }, [siteData.settings]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMessages().then(setMessages);
    }
  }, [isAuthenticated, activeTab]);

  // Service modal/form state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceSubtitle, setServiceSubtitle] = useState('');
  const [serviceBadge, setServiceBadge] = useState('');
  const [serviceImage, setServiceImage] = useState('/assets/reparo.jpeg');
  const [serviceItems, setServiceItems] = useState<string[]>(['']);
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Client form state
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [clientTitle, setClientTitle] = useState('');
  const [clientDesc, setClientDesc] = useState('');
  const [clientImage, setClientImage] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);

  const showNotification = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPassword = getStoredPassword();
    if (passwordInput === validPassword) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Verifique e tente novamente.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      showNotification('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('A confirmação da senha não confere.');
      return;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    setNewPassword('');
    setConfirmPassword('');
    showNotification('Senha do administrador atualizada com sucesso!');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Settings Handlers ---
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    showNotification('Informações de contato e endereço atualizadas!');
  };

  // --- Service Handlers ---
  const openNewServiceForm = () => {
    setEditingServiceId(null);
    setServiceTitle('');
    setServiceSubtitle('');
    setServiceBadge('Especialidade Técnica');
    setServiceImage('/assets/reparo.jpeg');
    setServiceItems(['']);
    setShowServiceForm(true);
  };

  const openEditServiceForm = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setServiceTitle(srv.title);
    setServiceSubtitle(srv.subtitle);
    setServiceBadge(srv.badge || 'Especialidade Técnica');
    setServiceImage(srv.image);
    setServiceItems(srv.items.length > 0 ? [...srv.items] : ['']);
    setShowServiceForm(true);
  };

  const handleServiceItemChange = (index: number, value: string) => {
    setServiceItems((prev) =>
      prev.map((it, idx) => (idx === index ? value : it))
    );
  };

  const addServiceTopicRow = () => {
    setServiceItems((prev) => [...prev, '']);
  };

  const removeServiceTopicRow = (index: number) => {
    setServiceItems((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== index) : ['']
    );
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedItems = serviceItems
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (!serviceTitle.trim()) return;

    const payload = {
      title: serviceTitle.trim(),
      subtitle: serviceSubtitle.trim(),
      badge: serviceBadge.trim() || 'Engenharia Térmica',
      image: serviceImage.trim() || '/assets/reparo.jpeg',
      imageAlt: serviceTitle.trim(),
      items:
        cleanedItems.length > 0
          ? cleanedItems
          : ['Atendimento técnico especializado GFRIO.'],
    };

    if (editingServiceId) {
      await updateService({ id: editingServiceId, ...payload });
      showNotification('Serviço atualizado com sucesso!');
    } else {
      await addService(payload);
      showNotification('Novo serviço adicionado ao site!');
    }

    setShowServiceForm(false);
    setEditingServiceId(null);
  };

  const handleDeleteService = async (srv: ServiceItem) => {
    if (window.confirm(`Deseja realmente remover o serviço "${srv.title}"?`)) {
      await deleteService(srv.id);
      showNotification('Serviço removido.');
    }
  };

  // --- Client Handlers ---
  const openNewClientForm = () => {
    setEditingClientId(null);
    setClientTitle('');
    setClientDesc('');
    setClientImage('/assets/logo.jpg');
    setShowClientForm(true);
  };

  const openEditClientForm = (cli: ClientItem) => {
    setEditingClientId(cli.id);
    setClientTitle(cli.titulo);
    setClientDesc(cli.descricao);
    setClientImage(cli.imagem);
    setShowClientForm(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientTitle.trim()) return;

    const payload = {
      titulo: clientTitle.trim(),
      descricao: clientDesc.trim(),
      imagem: clientImage.trim() || '/assets/logo.jpg',
    };

    if (editingClientId) {
      await updateClient({ id: editingClientId, ...payload });
      showNotification('Dados do cliente atualizados!');
    } else {
      await addClient(payload);
      showNotification('Novo cliente adicionado à vitrine!');
    }

    setShowClientForm(false);
    setEditingClientId(null);
  };

  const handleDeleteClient = async (cli: ClientItem) => {
    if (window.confirm(`Deseja realmente remover o cliente "${cli.titulo}"?`)) {
      await deleteClient(cli.id);
      showNotification('Cliente removido.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteStoredMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showNotification('Mensagem removida.');
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar todos os dados originais de fábrica (endereço, serviços e clientes)?'
      )
    ) {
      await resetToDefaults();
      showNotification('Dados originais restaurados com sucesso!');
    }
  };

  // --- LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <div className="admin-auth-card__brand">
            <img
              src="/assets/logo.jpg"
              alt="Logo GFRIO"
              className="admin-auth-card__logo"
            />
            <span className="admin-auth-card__kicker">Acesso Restrito</span>
            <h1 className="admin-auth-card__title">Painel do Administrador</h1>
            <p className="admin-auth-card__subtitle">
              Insira a credencial de segurança para gerenciar contatos, endereço,
              serviços e clientes da GFRIO.
            </p>
          </div>

          <form onSubmit={handleLogin} className="admin-auth-form">
            <div className="admin-field">
              <label htmlFor="admin-password">Senha de Acesso</label>
              <div className="admin-password-box">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Digite a senha do painel"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Mostrar ou ocultar senha"
                >
                  <i
                    className={`bi ${
                      showPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {loginError && (
                <p className="contact-form__error" role="alert">
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-industrial btn-industrial--accent admin-auth-submit"
            >
              <i className="bi bi-unlock-fill" aria-hidden="true" />
              <span>Desbloquear Painel</span>
            </button>

            <button
              type="button"
              className="admin-auth-back"
              onClick={onExitAdmin}
            >
              <i className="bi bi-arrow-left" aria-hidden="true" />
              <span>Voltar para o site público</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__brand">
            <img
              src="/assets/logo.jpg"
              alt="GFRIO"
              className="admin-topbar__logo"
            />
            <div>
              <span className="admin-topbar__badge">Painel Administrativo</span>
              <h1 className="admin-topbar__title">
                Gestão de Conteúdo · GFRIO
              </h1>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <button
              type="button"
              className="btn-industrial btn-industrial--ghost"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              <span>Restaurar Padrões</span>
            </button>
            <button
              type="button"
              className="btn-industrial btn-industrial--ghost"
              onClick={handleLogout}
              title="Bloquear painel com senha"
            >
              <i className="bi bi-lock-fill" aria-hidden="true" />
              <span>Bloquear</span>
            </button>
            <button
              type="button"
              className="btn-industrial btn-industrial--accent"
              onClick={onExitAdmin}
            >
              <i className="bi bi-box-arrow-left" aria-hidden="true" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-workspace">
        {toast && (
          <div className="admin-toast" role="status">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span>{toast}</span>
          </div>
        )}

        <div
          className="admin-tabs"
          role="tablist"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            className={`admin-tab ${
              activeTab === 'settings' ? 'admin-tab--active' : ''
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-geo-alt-fill" aria-hidden="true" />
            <div>
              <strong>Contato, Endereço e Senha</strong>
              <span>Telefone, WhatsApp, endereço e segurança</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'services'}
            className={`admin-tab ${
              activeTab === 'services' ? 'admin-tab--active' : ''
            }`}
            onClick={() => setActiveTab('services')}
          >
            <i className="bi bi-tools" aria-hidden="true" />
            <div>
              <strong>Serviços ({siteData.services.length})</strong>
              <span>Adicionar, editar ou remover serviços</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'clients'}
            className={`admin-tab ${
              activeTab === 'clients' ? 'admin-tab--active' : ''
            }`}
            onClick={() => setActiveTab('clients')}
          >
            <i className="bi bi-building-check" aria-hidden="true" />
            <div>
              <strong>Clientes ({siteData.clients.length})</strong>
              <span>Adicionar ou remover logos e unidades</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'messages'}
            className={`admin-tab ${
              activeTab === 'messages' ? 'admin-tab--active' : ''
            }`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="bi bi-envelope-paper-fill" aria-hidden="true" />
            <div>
              <strong>Solicitações ({messages.length})</strong>
              <span>Mensagens enviadas pelo Fale Conosco</span>
            </div>
          </button>
        </div>

        {/* TAB 1: CONTATO, ENDEREÇO & SEGURANÇA */}
        {activeTab === 'settings' && (
          <>
            <section className="admin-panel-card">
              <div className="admin-panel-card__header">
                <div>
                  <h2>Informações de Contato, Número e Endereço</h2>
                  <p>
                    Alterações salvas aqui atualizam imediatamente o cabeçalho,
                    botões de WhatsApp, seção de contato e rodapé do site.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit} className="admin-form">
                <div className="admin-form__grid-2">
                  <div className="admin-field">
                    <label htmlFor="phoneDisplay">
                      Telefone / Celular (Exibição no site)
                    </label>
                    <input
                      id="phoneDisplay"
                      type="text"
                      value={settingsForm.phoneDisplay}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          phoneDisplay: e.target.value,
                        })
                      }
                      placeholder="(84) 98773-9886"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="whatsappNumber">
                      Número do WhatsApp (Apenas números com DDI 55 + DDD)
                    </label>
                    <input
                      id="whatsappNumber"
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          whatsappNumber: e.target.value,
                        })
                      }
                      placeholder="5584987739886"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="addressLine1">
                      Endereço Principal (Rua, Número e Bairro)
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      value={settingsForm.addressLine1}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          addressLine1: e.target.value,
                        })
                      }
                      placeholder="Rua Saara, 122b - Cidade da Esperança"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="addressLine2">Cidade, Estado e CEP</label>
                    <input
                      id="addressLine2"
                      type="text"
                      value={settingsForm.addressLine2}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          addressLine2: e.target.value,
                        })
                      }
                      placeholder="Natal - RN, 59070-060"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="email">E-mail Corporativo</label>
                    <input
                      id="email"
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="diretoria@gfriorefrigeracao.com"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="businessHours">
                      Horário de Funcionamento
                    </label>
                    <input
                      id="businessHours"
                      type="text"
                      value={settingsForm.businessHours}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          businessHours: e.target.value,
                        })
                      }
                      placeholder="Segunda a sexta, das 7:30 às 17:00"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="mapsUrl">Link do Google Maps</label>
                    <input
                      id="mapsUrl"
                      type="url"
                      value={settingsForm.mapsUrl}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          mapsUrl: e.target.value,
                        })
                      }
                      placeholder="https://maps.app.goo.gl/..."
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="instagramUrl">Link do Instagram</label>
                    <input
                      id="instagramUrl"
                      type="url"
                      value={settingsForm.instagramUrl}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          instagramUrl: e.target.value,
                        })
                      }
                      placeholder="https://www.instagram.com/gfriooficial/"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form__footer">
                  <button
                    type="submit"
                    className="btn-industrial btn-industrial--primary"
                  >
                    <i className="bi bi-check2-circle" aria-hidden="true" />
                    <span>Salvar Alterações de Contato e Endereço</span>
                  </button>
                </div>
              </form>
            </section>

            <section
              className="admin-panel-card"
              style={{ marginTop: '1.75rem' }}
            >
              <div className="admin-panel-card__header">
                <div>
                  <h2>Segurança · Alterar Senha do Painel</h2>
                  <p>
                    Defina uma nova senha de acesso exclusivo para o painel de
                    administrador.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="admin-form">
                <div className="admin-form__grid-2">
                  <div className="admin-field">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo de 4 caracteres"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form__footer">
                  <button
                    type="submit"
                    className="btn-industrial btn-industrial--primary"
                  >
                    <i className="bi bi-key-fill" aria-hidden="true" />
                    <span>Atualizar Senha de Acesso</span>
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {/* TAB 2: SERVIÇOS */}
        {activeTab === 'services' && (
          <section className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2>Catálogo de Serviços Técnicos</h2>
                <p>
                  Adicione novas frentes de atuação, edite os itens de escopo
                  ou remova serviços existentes.
                </p>
              </div>
              <button
                type="button"
                className="btn-industrial btn-industrial--accent"
                onClick={openNewServiceForm}
              >
                <i className="bi bi-plus-lg" aria-hidden="true" />
                <span>Novo Serviço</span>
              </button>
            </div>

            {showServiceForm && (
              <form onSubmit={handleSaveService} className="admin-editor-box">
                <div className="admin-editor-box__top">
                  <h3>
                    {editingServiceId
                      ? 'Editar Serviço'
                      : 'Adicionar Novo Serviço'}
                  </h3>
                  <button
                    type="button"
                    className="admin-close-btn"
                    onClick={() => setShowServiceForm(false)}
                  >
                    Cancelar
                  </button>
                </div>

                <div className="admin-form__grid-2">
                  <div className="admin-field">
                    <label>Título do Serviço</label>
                    <input
                      type="text"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="Ex.: Instalação e Manutenção"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label>Selo / Categoria Técnica</label>
                    <input
                      type="text"
                      value={serviceBadge}
                      onChange={(e) => setServiceBadge(e.target.value)}
                      placeholder="Ex.: Frio Industrial & Comercial"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Subtítulo Descritivo</label>
                    <input
                      type="text"
                      value={serviceSubtitle}
                      onChange={(e) => setServiceSubtitle(e.target.value)}
                      placeholder="Ex.: Infraestrutura frigorífica e continuidade operacional"
                    />
                  </div>

                  <div className="admin-field">
                    <label>URL da Imagem ou Caminho (/assets/...)</label>
                    <div className="admin-image-input-group">
                      <input
                        type="text"
                        value={serviceImage}
                        onChange={(e) => setServiceImage(e.target.value)}
                        placeholder="/assets/reparo.jpeg"
                      />
                      <label className="admin-upload-btn">
                        <i className="bi bi-upload" aria-hidden="true" />
                        <span>Enviar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleImageUpload(e, (url) => setServiceImage(url))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-field" style={{ marginTop: '1.25rem' }}>
                  <div className="admin-topics-header">
                    <label>Itens de Escopo do Serviço</label>
                    <button
                      type="button"
                      className="admin-link-btn"
                      onClick={addServiceTopicRow}
                    >
                      <i className="bi bi-plus-circle" aria-hidden="true" />{' '}
                      Adicionar tópico
                    </button>
                  </div>

                  <div className="admin-topics-list">
                    {serviceItems.map((item, idx) => (
                      <div key={idx} className="admin-topic-row">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleServiceItemChange(idx, e.target.value)
                          }
                          placeholder={`Descrição do item técnico #${idx + 1}`}
                        />
                        <button
                          type="button"
                          className="admin-icon-delete"
                          onClick={() => removeServiceTopicRow(idx)}
                          title="Remover tópico"
                        >
                          <i className="bi bi-trash" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-form__footer">
                  <button
                    type="submit"
                    className="btn-industrial btn-industrial--primary"
                  >
                    <i className="bi bi-check2-circle" aria-hidden="true" />
                    <span>
                      {editingServiceId
                        ? 'Salvar Alterações no Serviço'
                        : 'Cadastrar Serviço'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            <div className="admin-items-grid">
              {siteData.services.map((srv) => (
                <article key={srv.id} className="admin-service-card">
                  <div className="admin-service-card__media">
                    <img src={srv.image} alt={srv.title} />
                    <span className="admin-service-card__badge">
                      {srv.badge || 'Engenharia'}
                    </span>
                  </div>
                  <div className="admin-service-card__body">
                    <h3>{srv.title}</h3>
                    {srv.subtitle && (
                      <p className="admin-service-card__sub">{srv.subtitle}</p>
                    )}
                    <ul className="admin-service-card__list">
                      {srv.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                    <div className="admin-service-card__actions">
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        onClick={() => openEditServiceForm(srv)}
                      >
                        <i className="bi bi-pencil-square" aria-hidden="true" />
                        <span>Modificar</span>
                      </button>
                      <button
                        type="button"
                        className="admin-btn-danger"
                        onClick={() => handleDeleteService(srv)}
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: CLIENTES */}
        {activeTab === 'clients' && (
          <section className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2>Carteira de Clientes Atendidos</h2>
                <p>
                  Adicione novos clientes parceiros, atualize logotipos ou
                  remova registros da vitrine.
                </p>
              </div>
              <button
                type="button"
                className="btn-industrial btn-industrial--accent"
                onClick={openNewClientForm}
              >
                <i className="bi bi-plus-lg" aria-hidden="true" />
                <span>Adicionar Cliente</span>
              </button>
            </div>

            {showClientForm && (
              <form onSubmit={handleSaveClient} className="admin-editor-box">
                <div className="admin-editor-box__top">
                  <h3>
                    {editingClientId
                      ? 'Editar Cliente'
                      : 'Adicionar Novo Cliente'}
                  </h3>
                  <button
                    type="button"
                    className="admin-close-btn"
                    onClick={() => setShowClientForm(false)}
                  >
                    Cancelar
                  </button>
                </div>

                <div className="admin-form__grid-2">
                  <div className="admin-field">
                    <label>Nome da Empresa / Cliente</label>
                    <input
                      type="text"
                      value={clientTitle}
                      onChange={(e) => setClientTitle(e.target.value)}
                      placeholder="Ex.: Super Fácil Atacado"
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label>Unidade ou Segmento (Opcional)</label>
                    <input
                      type="text"
                      value={clientDesc}
                      onChange={(e) => setClientDesc(e.target.value)}
                      placeholder="Ex.: Unidade Emaús"
                    />
                  </div>

                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Logo do Cliente (URL/Caminho ou Upload)</label>
                    <div className="admin-image-input-group">
                      <input
                        type="text"
                        value={clientImage}
                        onChange={(e) => setClientImage(e.target.value)}
                        placeholder="/assets/clientes/logo_superfacil.png"
                      />
                      <label className="admin-upload-btn">
                        <i className="bi bi-upload" aria-hidden="true" />
                        <span>Enviar Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleImageUpload(e, (url) => setClientImage(url))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-form__footer">
                  <button
                    type="submit"
                    className="btn-industrial btn-industrial--primary"
                  >
                    <i className="bi bi-check2-circle" aria-hidden="true" />
                    <span>
                      {editingClientId
                        ? 'Salvar Alterações do Cliente'
                        : 'Cadastrar Cliente'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            <div className="admin-clients-grid">
              {siteData.clients.map((cli) => (
                <article key={cli.id} className="admin-client-card">
                  <div className="admin-client-card__logo">
                    <img src={cli.imagem} alt={cli.titulo} />
                  </div>
                  <div className="admin-client-card__info">
                    <h3>{cli.titulo}</h3>
                    <p>{cli.descricao || 'Cliente Parceiro GFRIO'}</p>
                  </div>
                  <div className="admin-client-card__actions">
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => openEditClientForm(cli)}
                    >
                      <i className="bi bi-pencil-square" aria-hidden="true" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => handleDeleteClient(cli)}
                    >
                      <i className="bi bi-trash" aria-hidden="true" />
                      <span>Remover</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: SOLICITAÇÕES / MENSAGENS RECEBIDAS */}
        {activeTab === 'messages' && (
          <section className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2>Caixa de Entrada · Solicitações de Orçamento</h2>
                <p>
                  Todas as mensagens enviadas pelo formulário Fale Conosco ficam
                  registradas aqui para consulta e resposta imediata.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <p style={{ color: 'var(--steel-muted)', padding: '1rem 0' }}>
                Nenhuma solicitação recebida até o momento.
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {messages.map((msg) => {
                  const digits = (msg.contato || '').replace(/\D/g, '');
                  const waReply = `https://api.whatsapp.com/send/?phone=55${digits}&text=${encodeURIComponent(
                    `Olá ${msg.name}, recebemos sua solicitação de orçamento no site da GFRIO!`
                  )}`;
                  return (
                    <article
                      key={msg.id}
                      style={{
                        border: '1px solid var(--galvanized-steel)',
                        borderLeft: '4px solid var(--gfrio-navy)',
                        padding: '1.25rem',
                        backgroundColor: 'var(--frost-alabaster)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            color: 'var(--cryo-navy)',
                          }}
                        >
                          {msg.name}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--steel-muted)',
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '1.25rem',
                          fontSize: '0.9rem',
                        }}
                      >
                        <span>
                          <strong>E-mail:</strong> {msg.email}
                        </span>
                        <span>
                          <strong>Telefone/WhatsApp:</strong> {msg.contato}
                        </span>
                      </div>

                      <p
                        style={{
                          backgroundColor: '#fff',
                          padding: '0.85rem 1rem',
                          border: '1px solid var(--galvanized-steel)',
                          borderRadius: '3px',
                        }}
                      >
                        {msg.mensagem}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.65rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {digits && (
                          <a
                            href={waReply}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-secondary"
                            style={{ flex: '0 0 auto' }}
                          >
                            <i className="bi bi-whatsapp" aria-hidden="true" />
                            <span>Responder no WhatsApp</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Retorno GFRIO Refrigeração Comercial`}
                          className="admin-btn-secondary"
                          style={{ flex: '0 0 auto' }}
                        >
                          <i
                            className="bi bi-envelope-fill"
                            aria-hidden="true"
                          />
                          <span>Responder por E-mail</span>
                        </a>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ flex: '0 0 auto' }}
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <i className="bi bi-trash" aria-hidden="true" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
