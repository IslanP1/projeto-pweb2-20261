# Instruções de execução do projeto

Esse projeto consiste em duas aplicações:

- `financas-api` (Backend)
- `financas-webapp` (Frontend, onde será desenvolvido o projeto)

Abaixo estão as instruções para executar cada uma delas. Certifique-se de ter o Java 21 e o Node.js instalados em sua máquina.

## Executando o Backend

1. Navegue até a pasta `financas-api`:

   ```bash
   cd financas-api
   ```

2. Compile e execute a aplicação Spring Boot:

   ```bash
   ./mvnw spring-boot:run
   ```

   O backend estará disponível em `http://localhost:8080`. A documentação da API estará disponível em `http://localhost:8080/swagger-ui.html`.

Não é necessário utilizar PostgreSQL ou qualquer container. Essa aplicação utiliza um banco de dados em memória (H2) que é inicializado automaticamente com dados de exemplo a cada execução.

Altere os scripts dentro do diretório `src/main/resources/db/migration` caso queira modificar os dados iniciais ou criar mais dados (novos usuários, transações, categorias, etc.).

## Executando o frontend

O projeto de frontend é composto por duas aplicações:

- `financas-webapp` — aplicação principal (shell), com todas as telas (RF01 a RF06)
- `financas-mfe-cotacoes` — microfrontend de Cotações/Conversor de moedas (RF07), carregado em tempo de execução pelo shell via **Module Federation**

### 1. Aplicação principal (`financas-webapp`)

```bash
cd financas-webapp
npm install
npm run dev
```

Estará disponível em `http://localhost:5173`.

### 2. Microfrontend de Cotações (`financas-mfe-cotacoes`)

Necessário apenas para visualizar a tela `/cotacoes` (RF07) — o restante da aplicação funciona normalmente sem ele.

```bash
cd financas-mfe-cotacoes
npm install
npm run dev
```

Estará disponível em `http://localhost:5174` (também pode ser acessado isoladamente, fora do shell). O shell consome o módulo em tempo real a partir de `http://localhost:5174/remoteEntry.js`; se essa aplicação não estiver rodando, a tela `/cotacoes` exibe um aviso de módulo indisponível em vez de quebrar o restante do app.

### Testes automatizados

```bash
cd financas-webapp
npm test          # roda a suíte Vitest uma vez
npm run test:watch  # modo watch
```

### Build de produção

Cada aplicação tem seu próprio build (`npm run build`) e pode ser publicada separadamente. Ao publicar em produção, atualize a URL do `remoteEntry.js` do `financas-mfe-cotacoes` na configuração de federation de `financas-webapp/vite.config.ts` (hoje fixa em `http://localhost:5174`).
