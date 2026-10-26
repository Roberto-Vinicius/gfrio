import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  imageAlt: string;
  items: string[];
}

export interface ClientItem {
  id: string;
  titulo: string;
  imagem: string;
  descricao: string;
}

export interface CompanySettings {
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  mapsUrl: string;
  businessHours: string;
  instagramUrl: string;
}

export interface SiteData {
  settings: CompanySettings;
  services: ServiceItem[];
  clients: ClientItem[];
}

const STORAGE_KEY = 'gfrio_site_data_v1';
const API_BASE =
  typeof window !== 'undefined' && window.location.port === '4200'
    ? 'http://localhost:3001'
    : '';
const API_DATA_URL = `${API_BASE}/api/site-data`;

export const DEFAULT_SITE_DATA: SiteData = {
  settings: {
    phoneDisplay: '(84) 98773-9886',
    whatsappNumber: '5584987739886',
    email: 'diretoria@gfriorefrigeracao.com',
    addressLine1: 'Rua Saara, 122b - Cidade da Esperança',
    addressLine2: 'Natal - RN, 59070-060',
    mapsUrl: 'https://maps.app.goo.gl/W1hRy1Txzoj5oMkG8',
    businessHours: 'Segunda a sexta, das 7:30 às 17:00',
    instagramUrl: 'https://www.instagram.com/gfriooficial/',
  },
  services: [
    {
      id: 'instalacao-manutencao',
      title: 'Instalação e Manutenção',
      subtitle: 'Infraestrutura frigorífica e continuidade operacional',
      badge: 'Frio Industrial & Comercial',
      image: '/assets/reparo.jpeg',
      imageAlt:
        'Equipe técnica realizando instalação e manutenção de equipamentos de refrigeração',
      items: [
        'Instalação de câmaras frigoríficas (painéis de poliuretano, túnel de congelamento).',
        'Montagem de infraestrutura e unidades condensadoras (resfriado e congelado).',
        'Manutenção preventiva e corretiva de racks, unidades evaporadoras, compressores (aberto/semi-hermético), chillers e centrais de água gelada.',
      ],
    },
    {
      id: 'consultoria-projetos',
      title: 'Consultoria, Assessoria e Projetos',
      subtitle: 'Dimensionamento térmico e supervisão de engenharia',
      badge: 'Engenharia & Projetos',
      image: '/assets/projeto.jpg',
      imageAlt:
        'Desenvolvimento de projetos e consultoria técnica de refrigeração e climatização',
      items: [
        'Consultoria, assessoria e supervisão técnica em sistemas de refrigeração e climatização.',
        'Desenvolvimento de projetos para câmaras frigoríficas.',
        'Desenvolvimento de projetos para salas limpas e sistemas de climatização (VRF).',
      ],
    },
    {
      id: 'solucoes-personalizadas',
      title: 'Soluções Personalizadas',
      subtitle: 'Ambientes controlados, salas limpas e eficiência energética',
      badge: 'Sistemas VRF & Salas Limpas',
      image: '/assets/manutencao.jpeg',
      imageAlt:
        'Manutenção especializada e montagem de sistemas VRF e salas limpas',
      items: [
        'Montagem e instalação de sistemas VRF.',
        'Manutenção preventiva e corretiva em salas limpas e sistemas VRF.',
        'Soluções eficientes e sustentáveis, adaptadas às necessidades específicas de cada cliente.',
      ],
    },
  ],
  clients: [
    {
      id: 'cliente-over',
      titulo: 'Colégio e Curso Over',
      imagem: '/assets/clientes/over.png',
      descricao: 'Educação e Climatização Institucional',
    },
    {
      id: 'cliente-sal-e-brasa',
      titulo: 'Grupo Sal e Brasa',
      imagem: '/assets/clientes/logo-sal-e-brasa.png',
      descricao: 'Gastronomia e Cadeia do Frio',
    },
    {
      id: 'cliente-super-facil',
      titulo: 'Super Fácil',
      imagem: '/assets/clientes/logo_superfacil.png',
      descricao: 'Unidade Emaús',
    },
    {
      id: 'cliente-queiros',
      titulo: 'Queiros Atacado',
      imagem: '/assets/clientes/queiros_atacado.png',
      descricao: 'Unidade São Gonçalo do Amarante',
    },
    {
      id: 'cliente-ster-bom',
      titulo: 'Grupo Ster Bom',
      imagem: '/assets/clientes/ster_bom.jpg',
      descricao: 'Indústria Alimentícia e Congelados',
    },
    {
      id: 'cliente-multigiro',
      titulo: 'Grupo Multigiro',
      imagem: '/assets/clientes/multigiro.png',
      descricao: 'Distribuição e Logística',
    },
    {
      id: 'cliente-bom-frio',
      titulo: 'Bom Frio',
      imagem: '/assets/clientes/bom_frio.png',
      descricao: 'Shopping Cidade Verde',
    },
  ],
};

interface SiteDataContextValue {
  siteData: SiteData;
  whatsappUrl: string;
  updateSettings: (settings: CompanySettings) => Promise<void>;
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addClient: (client: Omit<ClientItem, 'id'>) => Promise<void>;
  updateClient: (client: ClientItem) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(
  undefined
);

function loadInitialData(): SiteData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        settings: { ...DEFAULT_SITE_DATA.settings, ...parsed.settings },
        services: Array.isArray(parsed.services)
          ? parsed.services
          : DEFAULT_SITE_DATA.services,
        clients: Array.isArray(parsed.clients)
          ? parsed.clients
          : DEFAULT_SITE_DATA.clients,
      };
    }
  } catch (e) {
    console.warn('Falha ao ler dados locais:', e);
  }
  return DEFAULT_SITE_DATA;
}

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [siteData, setSiteData] = useState<SiteData>(loadInitialData);

  // Tenta sincronizar com o backend ao iniciar, se estiver ativo
  useEffect(() => {
    fetch(API_DATA_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((remoteData) => {
        if (remoteData && remoteData.settings) {
          setSiteData(remoteData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        }
      })
      .catch(() => {
        // Backend opcional para leitura; mantém dados do localStorage
      });
  }, []);

  const persistData = async (nextData: SiteData) => {
    setSiteData(nextData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }

    try {
      await fetch(API_DATA_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextData),
      });
    } catch {
      // Caso o servidor Node na porta 3001 não esteja rodando no momento,
      // a persistência no navegador (localStorage) já garante o funcionamento.
    }
  };

  const cleanDigits = siteData.settings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${
    cleanDigits || '5584987739886'
  }&text&type=phone_number&app_absent=0`;

  const updateSettings = async (settings: CompanySettings) => {
    await persistData({ ...siteData, settings });
  };

  const addService = async (service: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    await persistData({
      ...siteData,
      services: [...siteData.services, newService],
    });
  };

  const updateService = async (updated: ServiceItem) => {
    await persistData({
      ...siteData,
      services: siteData.services.map((s) =>
        s.id === updated.id ? updated : s
      ),
    });
  };

  const deleteService = async (id: string) => {
    await persistData({
      ...siteData,
      services: siteData.services.filter((s) => s.id !== id),
    });
  };

  const addClient = async (client: Omit<ClientItem, 'id'>) => {
    const newClient: ClientItem = {
      ...client,
      id: `cli-${Date.now()}`,
    };
    await persistData({
      ...siteData,
      clients: [...siteData.clients, newClient],
    });
  };

  const updateClient = async (updated: ClientItem) => {
    await persistData({
      ...siteData,
      clients: siteData.clients.map((c) => (c.id === updated.id ? updated : c)),
    });
  };

  const deleteClient = async (id: string) => {
    await persistData({
      ...siteData,
      clients: siteData.clients.filter((c) => c.id !== id),
    });
  };

  const resetToDefaults = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await persistData(DEFAULT_SITE_DATA);
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        whatsappUrl,
        updateSettings,
        addService,
        updateService,
        deleteService,
        addClient,
        updateClient,
        deleteClient,
        resetToDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export function useSiteData(): SiteDataContextValue {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData deve ser usado dentro de um SiteDataProvider');
  }
  return ctx;
}
