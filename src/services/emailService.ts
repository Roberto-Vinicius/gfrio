export interface ContactFormData {
  name: string;
  email: string;
  contato: string;
  mensagem: string;
}

export interface StoredMessage extends ContactFormData {
  id: string;
  createdAt: string;
}

const API_BASE =
  typeof window !== 'undefined' && window.location.port === '4200'
    ? 'http://localhost:3001'
    : '';
const API_URL = `${API_BASE}/send-email`;
const LOCAL_MESSAGES_KEY = 'gfrio_contact_messages_v1';

export function getLocalMessages(): StoredMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessage(formData: ContactFormData) {
  try {
    const list = getLocalMessages();
    list.unshift({
      ...formData,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota errors
  }
}

export async function sendEmail(formData: ContactFormData): Promise<string> {
  saveLocalMessage(formData);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Falha ao enviar o e-mail');
  }

  return response.text();
}
