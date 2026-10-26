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

app.post('/send-email', (req, res) => {
  const formData = req.body || {};

  if (!formData.name || !formData.email || !formData.mensagem) {
    return res.status(400).send('Dados obrigatórios ausentes.');
  }

  // Registra a mensagem localmente para garantir que nenhum contato seja perdido
  const messageRecord = {
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: formData.name,
    email: formData.email,
    contato: formData.contato || '',
    mensagem: formData.mensagem,
    smtpDelivered: false,
  };

  // Configuração do transporte com o Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    connectionTimeout: 6000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    auth: {
      user: 'testrabalho10@gmail.com',
      pass: 'yaxj gixo amhb duuw',
    },
  });

  const mailOptions = {
    from: `"GFRIO Site - ${formData.name}" <testrabalho10@gmail.com>`,
    replyTo: formData.email, // E-mail do cliente para resposta direta
    to: 'robertoviniciusfoda@gmail.com', // E-mail da empresa
    subject: `Contato de ${formData.name} - Site GFRIO`,
    text: `Nome: ${formData.name}\nE-mail: ${formData.email}\nContato: ${formData.contato}\nMensagem: ${formData.mensagem}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.warn(
        'Aviso SMTP (porta 587 bloqueada na rede ou falha SMTP):',
        error.code || error.message
      );
      messageRecord.smtpError = error.code || error.message;
      saveMessage(messageRecord);
      return res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send('Solicitação registrada com sucesso!');
    }

    messageRecord.smtpDelivered = true;
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
