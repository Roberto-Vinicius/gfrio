const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const formData = req.body;
  // Configuração do transporte com o Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'testrabalho10@gmail.com',
      pass: 'yaxj gixo amhb duuw',
    },
  });

  const mailOptions = {
    from: formData.email, // E-mail do cliente
    to: 'robertoviniciusfoda@gmail.com', // E-mail da sua empresa
    subject: `Contato de ${formData.name}`,
    text: `Nome: ${formData.name}\nE-mail: ${formData.email}\nContato: ${formData.contato}\nMensagem: ${formData.mensagem}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
      return res.status(500).send(error.toString());
    }
    res.status(200).set('Content-Type', 'text/plain').send('E-mail enviado com sucesso!');
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando');
});