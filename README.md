# Chaos GPT

> "Em 2026, testar não é apenas garantir que o código funciona quando tudo está perfeito. Testar é garantir que o sistema sobrevive quando o mundo ao redor dele está pegando fogo."

Plataforma educacional de e-commerce construída em Next.js para demonstrar na prática os conceitos de **Engenharia do Caos** aplicados a sistemas com IA.

O sistema é um e-commerce de capivaras de pelúcia com uma API de IA para cálculo de frete dinâmico. Os alunos aprendem quebrando o sistema de propósito.

---

## O que o sistema demonstra

- **Engenharia do Caos**: injetar falhas controladas para descobrir fraquezas antes da produção
- **Prompt Injection Testing**: atacar a camada de IA com entradas absurdas e engenharia social
- **AI Chaos Monkey**: automatizar a injeção de caos em pipelines de CI/CD
- **Circuit Breaker**: padrão arquitetural que isola falhas e ativa fallbacks automaticamente
- **Resiliência de APIs de terceiros**: o sistema sobrevive quando a API de IA some

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Auth | Firebase Auth |
| Banco | Firestore |
| IA | Claude (Anthropic SDK) |
| Estado | Zustand + TanStack Query |
| Validação | Zod |
| Testes | Jest + RTL + Cypress |
| Observabilidade | Sentry + Langfuse |
| Deploy | Vercel |

---

## Estrutura do Projeto

```
/src
  /app
    /loja              → Listagem de produtos (capivaras)
    /carrinho          → Carrinho com Circuit Breaker ativo
    /checkout          → Finalização com frete calculado por IA
    /chaos             → Painel de Controle do Caos (rota protegida)
    /admin             → Dashboard administrativo
    /api
      /frete-ia        → API Route: cálculo de frete com IA
      /chaos           → API Route: injeção de falhas (apenas em staging)
  /components
    /ui                → Componentes shadcn/ui
    /shared            → Header, Footer, Layout
    /features
      /cart            → CartDrawer, CartItem, CartSummary
      /checkout        → FreightCalculator, OrderSummary
      /chaos           → ChaosPanel, BlastRadiusConfig, MetricsDisplay
      /circuit-breaker → CircuitBreakerStatus, FallbackBanner
  /features
    /loja              → Hooks e lógica da loja
    /cart              → Hooks e lógica do carrinho
    /checkout          → Hooks e lógica de checkout
    /chaos             → Hooks e lógica do painel de caos
  /lib
    /firebase          → Configuração Firebase centralizada
    /circuit-breaker   → CircuitBreaker class (Open/Half-Open/Closed)
    /chaos-engine      → Motor de injeção de caos local (dev/staging)
    /ai                → Configuração do cliente Anthropic
  /services
    /freight-ai        → Serviço de frete com IA + fallback
    /products          → CRUD de produtos no Firestore
    /orders            → CRUD de pedidos no Firestore
    /chaos             → Serviço de chaos injection
  /ai
    /agents            → Agente de frete
    /tools             → Tools do agente (calcular_frete, verificar_estoque)
    /prompts           → System prompts versionados
    /guardrails        → Validação de inputs e outputs da IA
    /schemas           → Zod schemas para tool calling
  /hooks               → Custom hooks compartilhados
  /schemas             → Zod schemas de domínio
  /types               → TypeScript types globais
  /stores              → Zustand stores (cart, chaos state)
/firebase              → Firebase config e rules
/cypress
  /e2e
    /checkout.cy.ts    → Fluxo feliz de compra
    /chaos.cy.ts       → Compra com API de frete falhando (Circuit Breaker)
    /prompt-injection.cy.ts → Tentativas de injeção no cupom e no frete
/docs                  → Documentação do projeto
.github/workflows
  /ci.yml              → Build + testes unitários
  /chaos-testing.yml   → Chaos stage completo (staging → caos → validação → prod)
```

---

## Como rodar

```bash
# 1. Instale dependências
npm install

# 2. Configure variáveis de ambiente
cp .env.example .env.local
# Preencha: ANTHROPIC_API_KEY, FIREBASE_*, GREMLIN_API_KEY (opcional)

# 3. Rode em desenvolvimento
npm run dev

# 4. Testes unitários
npm test

# 5. Testes E2E
npm run test:e2e

# 6. Testes com caos simulado (modo local)
npm run test:chaos

# 7. Lint e build
npm run lint && npm run build
```

---

## O Experimento Principal

**Cenário:** a API de IA de frete vai ficar 15 segundos sem responder.

1. Acesse `/chaos` (requer login de professor)
2. Configure a falha: **Tipo: Latência | Alvo: api-frete-ia | Delay: 15000ms | Duração: 60s**
3. Clique em **Disparar Caos**
4. Abra o carrinho e tente finalizar uma compra
5. Observe: o Circuit Breaker detecta a lentidão após 3s, abre o disjuntor, ativa o fallback (frete fixo R$ 10,00) e o cliente consegue comprar

**Hipótese validada:** "Se a API de frete falhar, o sistema ativa o fallback e o cliente nunca vê tela branca."

---

## Desafio para os Alunos: Prompt Injection

Tente fazer o sistema aceitar o cupom `ME_DA_DESCONTO_OU_O_GATINHO_CHORA` que zera o carrinho. O objetivo é encontrar falhas de lógica de integração que testes tradicionais de caixa-preta não pegam.

---

## Pipeline CI/CD com Caos

```
[Build] → [Testes Unitários/E2E] → [Deploy Homologação] → [DISPARAR CAOS] → [Validar Métricas] → [Deploy Produção]
```

Ver `.github/workflows/chaos-testing.yml`

---

## Documentação

| Doc | Descrição |
|-----|-----------|
| [PRD](docs/PRD.md) | Requisitos do produto |
| [Arquitetura](docs/ARCHITECTURE.md) | Stack e estrutura técnica |
| [Backlog](docs/TASKS.md) | Tarefas e progresso |
| [Testes](docs/TESTING.md) | Estratégia de testes |
| [Design](docs/DESIGN.md) | Design system e UI |
| [Agente de IA](docs/AI_AGENT.md) | Arquitetura do agente de frete |
| [Aula](docs/AULA.md) | Plano de aula completo com teoria e prática |
| [Deploy](docs/DEPLOY.md) | Checklist de deploy |
