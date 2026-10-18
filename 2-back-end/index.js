// Carrega as variáveis de ambiente definidas no arquivo .env
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Importa os módulos necessários
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Define o schema do usuário
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

// Cria o modelo do usuário com base no schema definido
const Usuario = mongoose.model('Usuarios', usuarioSchema);
const app = express();
const port = Number(process.env.PORT || 3000);
const origensPermitidas = (process.env.FRONTEND_ORIGINS ||
  'http://localhost:5500,http://127.0.0.1:5500')
  .split(',')
  .map(origem => origem.trim())
  .filter(Boolean);

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors({ origin: origensPermitidas }));

// Rota para cadastro de usuários
app.post('/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body || {};

  // Validação dos campos obrigatórios
  const camposObrigatorios = { nome: 'nome', sobrenome: 'sobrenome', email: 'email', senha: 'senha' };
  for (const [campo, rotulo] of Object.entries(camposObrigatorios)) {
    if (typeof req.body?.[campo] !== 'string' || req.body[campo].trim().length === 0) {
      return res.status(400).json({ mensagem: `${rotulo} é obrigatório.` });
    }
  }

  try {
    // Verifica se o email já está cadastrado no banco de dados
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Este email já está cadastrado.' });
    }
// Criptografa a senha antes de salvar no banco de dados
    const senhaHash = await bcrypt.hash(senha, 12);
    const usuario = await Usuario.create({
      nome,
      sobrenome,
      email,
      senha: senhaHash
    });
// Retorna uma resposta de sucesso com os dados do usuário cadastrado
    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      dados: {
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email
      }
    });
  } catch (error) {
    // Trata erros específicos de validação e duplicidade de email
    if (error.code === 11000) {
      return res.status(409).json({ mensagem: 'Este email já está cadastrado.' });
    }
// Trata erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensagem: 'Dados de cadastro inválidos.' });
    }
// Trata outros erros inesperados
    console.error('Erro ao realizar cadastro:', error.message);
    res.status(500).json({ mensagem: 'Não foi possível realizar o cadastro.' });
  }
});

// Função para iniciar o servidor e conectar ao MongoDB Atlas
async function iniciarServidor() {
  if (!process.env.MONGODB_URI) {
    console.error('A variável MONGODB_URI não foi definida. Configure o arquivo 2-back-end/.env.');
    process.exitCode = 1;
    return;
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('A variável PORT deve ser um número entre 1 e 65535.');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB Atlas');
// Inicia o servidor na porta definida
    app.listen(port, () => {
      console.log(`API rodando no endereço http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a API:', error.message);
    process.exitCode = 1;
  }
}
// Chama a função para iniciar o servidor
iniciarServidor();