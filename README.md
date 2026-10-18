# banco-api-performance

## Introdução

Este repositório reúne scripts de testes de performance escritos em JavaScript e executados com [Grafana k6](https://grafana.com/docs/k6/latest/). Os cenários exercitam endpoints da API REST `banco-api`, como login e transferências, para observar o comportamento da aplicação sob carga.

O endereço da API é configurado pela variável `BASE_URL`, permitindo executar os mesmos scripts contra ambientes diferentes. A API e o banco de dados precisam estar disponíveis antes de iniciar os testes.

## Tecnologias utilizadas

- **JavaScript:** linguagem usada para escrever os cenários de teste.
- **Grafana k6:** ferramenta de código aberto para testes de carga e performance.
- **Web Dashboard do k6:** acompanha métricas em tempo real e exporta um relatório HTML.
- **API REST banco-api:** aplicação alvo dos cenários em `tests/`.

## Estrutura do repositório

```text
banco-api-performance/
├── Fixtures/
│   └── postLogin.json
├── config/
│   └── config.local.json
├── helpers/
│   └── autenticacao.js
├── tests/
│   ├── login.test.js
│   └── transferencias.test.js
├── utils/
│   └── variaveis.js
├── script.js
├── .gitignore
└── README.md
```

## Objetivo de cada grupo de arquivos

- **`tests/`** — contém os cenários de carga da API. `login.test.js` simula requisições de login e verifica status e token; `transferencias.test.js` executa uma transferência usando autenticação.
- **`helpers/`** — reúne funções reutilizáveis. `autenticacao.js` chama `/login` e obtém o token usado nos testes autenticados.
- **`utils/`** — concentra utilitários compartilhados. `variaveis.js` obtém a URL base: usa `BASE_URL` quando informada e, caso contrário, recorre ao valor local de configuração.
- **`Fixtures/`** — guarda dados de entrada para os cenários. `postLogin.json` contém o payload de login de teste.
- **`config/`** — contém a configuração local de fallback, incluindo a URL padrão da API em `config.local.json`.
- **`script.js`** — exemplo independente de um teste k6 contra `https://quickpizza.grafana.com`; não usa `BASE_URL` nem os cenários da API bancária em `tests/`.
- **`.gitignore`** — ignora o relatório gerado `html-report.html`.

> Use apenas credenciais de teste em `Fixtures/postLogin.json`. Não coloque credenciais reais ou senhas de produção no repositório.

## Instalação e execução

### 1. Pré-requisitos

- Instale o [Grafana k6](https://grafana.com/docs/k6/latest/set-up/install-k6/). No macOS com Homebrew:

  ```bash
  brew install k6
  ```

- Confirme a instalação:

  ```bash
  k6 version
  ```

- Inicie a API `banco-api` e o banco de dados usados pelo ambiente de teste.
- Clone o repositório e entre na pasta:

  ```bash
  git clone https://github.com/abraaolincoln19/banco-api-performance.git
  cd banco-api-performance
  ```

Este projeto não possui `package.json`: não é necessário executar `npm install`. O k6 executa diretamente os scripts JavaScript e fornece os módulos padrão usados neles.

### 2. Definir a URL da API

Passe `BASE_URL` ao executar o k6. A variável é lida pelos scripts por meio de `__ENV.BASE_URL` e tem prioridade sobre `config/config.local.json`.

Exemplo para macOS/Linux, executando o cenário de login:

```bash
k6 run -e BASE_URL=http://localhost:3000 tests/login.test.js
```

Para executar o cenário de transferências:

```bash
k6 run -e BASE_URL=http://localhost:3000 tests/transferencias.test.js
```

Substitua `http://localhost:3000` pelo endereço onde sua API está disponível. O uso de `-e BASE_URL=...` também funciona no Windows.

### 3. Acompanhar o teste em tempo real e exportar o relatório

No macOS/Linux, habilite o Web Dashboard e exporte o relatório HTML ao final da execução:

```bash
BASE_URL=http://localhost:3000 \
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_EXPORT=html-report.html \
k6 run tests/login.test.js
```

Durante a execução, acompanhe as métricas em [http://localhost:5665](http://localhost:5665). O arquivo `html-report.html` é criado na pasta atual **quando o teste termina**. O dashboard mostra os resultados em tempo real; a exportação HTML ocorre ao final.

Para fazer o mesmo com o cenário de transferências:

```bash
BASE_URL=http://localhost:3000 \
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_EXPORT=html-report.html \
k6 run tests/transferencias.test.js
```

No PowerShell do Windows, use:

```powershell
$env:BASE_URL = "http://localhost:3000"
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_EXPORT = "html-report.html"
k6 run tests/login.test.js
```

O relatório `html-report.html` está listado no `.gitignore` e, portanto, não aparece como arquivo novo no `git status`.

> Para que o HTML inclua gráficos, a duração do teste deve ser maior que três vezes o período de agregação do dashboard. Consulte a [documentação do Web Dashboard do k6](https://grafana.com/docs/k6/latest/results-output/web-dashboard/) para ajustar as opções.
