# Plataforma de cadastro simples

Projeto de cadastro com formulário HTML/CSS/JavaScript e API Node.js, Express e MongoDB.

## Requisitos

- Node.js e npm
- Uma instância MongoDB (local ou MongoDB Atlas)

## Configuração

1. Instale as dependências do back-end na raiz do projeto:

   ```powershell
   npm install --prefix 2-back-end
   ```

2. Crie `2-back-end/.env` a partir do modelo:

   ```powershell
   Copy-Item 2-back-end/.env.example 2-back-end/.env
   ```

3. Edite `2-back-end/.env` e substitua o valor de `MONGODB_URI` pela URI da sua instância MongoDB. Não publique nem compartilhe esse arquivo.

4. Inicie a API na raiz do projeto:

   ```powershell
   npm start
   ```

   A API usa a porta `3000` por padrão. Você pode definir outra porta pela variável `PORT`.

5. Sirva a pasta `1-front-end` com um servidor web local, por exemplo a extensão Live Server do VS Code na porta `5500`, e abra `index.html` por esse servidor. O endereço deve corresponder a uma das origens em `FRONTEND_ORIGINS`.

## Publicação

- Configure `MONGODB_URI`, `PORT` e `FRONTEND_ORIGINS` como variáveis de ambiente no serviço que hospeda a API.
- Em `FRONTEND_ORIGINS`, informe apenas a origem publicada do front-end (esquema, domínio e porta, se houver).
- Atualize a meta `api-base-url` em `1-front-end/index.html` para o endereço público da API.
- Publique o site e a API usando HTTPS.
- O `.gitignore` exclui arquivos `.env` e `node_modules`. Mantenha as credenciais somente nas variáveis de ambiente; o arquivo `.env.example` contém valores fictícios.

Se uma URI de banco de dados real já foi enviada para um repositório público, considere-a comprometida: troque a senha/credencial no provedor e atualize o segredo no ambiente de execução. Remover o arquivo em um commit posterior não apaga seu conteúdo do histórico do Git.
