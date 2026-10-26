const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

const DATA_FILE = path.join(__dirname, 'site-data.json');
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');

function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveMessage(entry) {
  const list = readMessages();
  list.unshift(entry);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

async function sendViaHttpsRelay(formData) {
  const params = new URLSearchParams({
    _subject: `Contato de ${formData.name} - Site GFRIO`,
    _template: 'table',
    _captcha: 'false',
    Nome: formData.name,
    Email: formData.email,
    Contato: formData.contato || '',
    Mensagem: formData.mensagem,
  });

  const response = await fetch(
    'https://formsubmit.co/ajax/robertoviniciusfoda@gmail.com',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
        Origin: 'https://gfrio.onrender.com',
        Referer: 'https://gfrio.onrender.com/',
      },
      body: params.toString(),
    }
  );

  const data = await response.json();
  return data;
}

// Endpoint para leitura dos dados configuráveis do site (Admin)
app.get('/api/site-data', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res
      .status(404)
      .json({ message: 'Arquivo de dados ainda não inicializado.' });
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return res.status(200).json(JSON.parse(raw));
  } catch (err) {
    console.error('Erro ao ler site-data.json:', err);
    return res.status(500).json({ error: 'Erro ao ler dados do servidor.' });
  }
});

// Endpoint para salvar alterações feitas no painel Admin
app.put('/api/site-data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    return res.status(200).json({ status: 'ok', data: req.body });
  } catch (err) {
    console.error('Erro ao salvar site-data.json:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar dados no servidor.' });
  }
});

// Endpoint para listar mensagens recebidas pelo formulário
app.get('/api/messages', (req, res) => {
  return res.status(200).json(readMessages());
});

// Endpoint para excluir uma mensagem no Admin
app.delete('/api/messages/:id', (req, res) => {
  const next = readMessages().filter((m) => m.id !== req.params.id);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(next, null, 2), 'utf-8');
  return res.status(200).json({ status: 'ok' });
});

app.post('/send-email', async (req, res) => {
  const formData = req.body || {};

  if (!formData.name || !formData.email || !formData.mensagem) {
    return res.status(400).send('Dados obrigatórios ausentes.');
  }

  const messageRecord = {
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: formData.name,
    email: formData.email,
    contato: formData.contato || '',
    mensagem: formData.mensagem,
    deliveredVia: 'pending',
  };

  // 1) Tenta disparo via HTTPS (porta 443) - funciona no Render Free e redes corporativas que bloqueiam porta 587
  try {
    const relayResult = await sendViaHttpsRelay(formData);
    messageRecord.httpsRelay = relayResult;
    if (relayResult && relayResult.success === 'true') {
      messageRecord.deliveredVia = 'https-443';
      saveMessage(messageRecord);
      return res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send('E-mail enviado com sucesso!');
    }
  } catch (httpsErr) {
    console.warn('Aviso HTTPS relay:', httpsErr.message);
  }

  // 2) Tenta disparo via SMTP tradicional (porta 587) caso a rede permita
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    connectionTimeout: 4500,
    greetingTimeout: 4000,
    socketTimeout: 5000,
    auth: {
      user: 'testrabalho10@gmail.com',
      pass: 'yaxj gixo amhb duuw',
    },
  });

  const mailOptions = {
    from: `"GFRIO Site - ${formData.name}" <testrabalho10@gmail.com>`,
    replyTo: formData.email,
    to: 'robertoviniciusfoda@gmail.com',
    subject: `Contato de ${formData.name} - Site GFRIO`,
    text: `Nome: ${formData.name}\nE-mail: ${formData.email}\nContato: ${formData.contato}\nMensagem: ${formData.mensagem}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      messageRecord.smtpError = error.code || error.message;
      messageRecord.deliveredVia = 'saved-inbox';
      saveMessage(messageRecord);
      return res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send('Solicitação registrada com sucesso!');
    }

    messageRecord.deliveredVia = 'smtp-587';
    saveMessage(messageRecord);
    return res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send('E-mail enviado com sucesso!');
  });
});

// Serve o front-end compilado (dist/) em produção (Render, etc.)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor GFRIO rodando em 0.0.0.0:${PORT}`);
});
