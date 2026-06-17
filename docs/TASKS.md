# Backlog — Chaos GPT

## Fase 1: Setup e Fundação

- [ ] Inicializar projeto Next.js 15 com TypeScript strict
- [ ] Configurar Tailwind CSS + shadcn/ui (tema padrão)
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Firebase (Auth + Firestore + Storage)
- [ ] Criar `/src/lib/firebase` com client e admin SDK
- [ ] Configurar Zod como validador padrão
- [ ] Configurar TanStack Query para estado assíncrono
- [ ] Configurar Zustand para estado global (cart store, chaos store)
- [ ] Configurar Sentry para monitoramento de erros
- [ ] Configurar Langfuse para observabilidade da IA
- [ ] Criar layout base (Header, Footer, main wrapper)
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Configurar Jest + React Testing Library
- [ ] Configurar Cypress
- [ ] Criar scripts npm: `test`, `test:e2e`, `test:chaos`, `lint`, `build`

---

## Fase 2: Autenticação e Roles

- [ ] Criar fluxo de login com Firebase Auth (email/senha + Google)
- [ ] Criar fluxo de logout
- [ ] Criar hook `useAuth` (user, loading, role)
- [ ] Criar sistema de roles no Firestore: `aluno` | `professor` | `admin`
- [ ] Criar middleware Next.js para proteger rotas por role
- [ ] Criar rota `/login` com formulário shadcn/ui
- [ ] Criar rota `/admin` (apenas admin)
- [ ] Criar rota `/chaos` (apenas professor e admin)
- [ ] Testes unitários: `useAuth`, middleware de role
- [ ] Testes E2E: login, logout, acesso negado

---

## Fase 3: E-commerce — Produtos e Carrinho

- [ ] Criar schema Zod: `Product` (id, nome, preco, estoque, imageUrl, descricao)
- [ ] Criar service `products`: listar, buscar por id, atualizar estoque
- [ ] Criar rota `/loja` com listagem de capivaras de pelúcia
- [ ] Criar componente `ProductCard` (imagem, nome, preço, botão adicionar)
- [ ] Criar `CartStore` (Zustand): add, remove, clear, calcular total
- [ ] Criar componente `CartDrawer` (slide-in lateral)
- [ ] Criar componente `CartItem` com controle de quantidade
- [ ] Criar rota `/carrinho` (versão mobile-friendly)
- [ ] Validar estoque antes de adicionar ao carrinho
- [ ] Persistir carrinho no localStorage
- [ ] Testes unitários: CartStore, validações de estoque
- [ ] Testes de componente: CartDrawer, CartItem, ProductCard

---

## Fase 4: Agente de IA — Cálculo de Frete

- [ ] Instalar Anthropic SDK (`@anthropic-ai/sdk`)
- [ ] Criar `/src/ai/prompts/frete-system-prompt.ts` versionado
- [ ] Criar schema Zod para input do agente: `{ cep, peso, itens[] }`
- [ ] Criar schema Zod para output do agente: `{ valorFrete, prazoEntrega, justificativa }`
- [ ] Criar tool `calcular_frete` com schema Zod
- [ ] Criar agente de frete em `/src/ai/agents/freight-agent.ts`
- [ ] Criar guardrail: rejeitar inputs fora do domínio (prompt injection)
- [ ] Criar guardrail: validar output antes de usar (nunca confiar diretamente na IA)
- [ ] Criar service `freight-ai` que chama o agente e retorna o resultado
- [ ] Criar API Route `/api/frete-ia` (POST) com rate limiting (Upstash Redis)
- [ ] Criar hook `useFreightCalculation` (loading, error, data, fallback ativo)
- [ ] Criar componente `FreightCalculator` (input CEP, resultado, indicador de fallback)
- [ ] Logar todas as execuções no Langfuse: input, output, tokens, custo, erros
- [ ] Testes unitários: guardrails, schema validation, freight-ai service (mock)
- [ ] Testes de integração: API Route com mocks do agente

---

## Fase 5: Circuit Breaker

- [ ] Implementar classe `CircuitBreaker` em `/src/lib/circuit-breaker/`
  - Estados: `CLOSED` (normal) | `OPEN` (falha detectada) | `HALF_OPEN` (testando recuperação)
  - Config: `failureThreshold` (padrão: 3), `timeout` (padrão: 30s), `successThreshold` (padrão: 1)
- [ ] Integrar CircuitBreaker ao service `freight-ai`
- [ ] Criar fallback: frete fixo R$ 10,00 quando circuito está aberto
- [ ] Expor estado do CircuitBreaker via `/api/circuit-breaker/status`
- [ ] Criar componente `CircuitBreakerStatus` (badge colorido: verde/vermelho/amarelo)
- [ ] Criar componente `FallbackBanner` (aviso de frete fixo ativo)
- [ ] Persistir estado do CircuitBreaker no Redis (Upstash) para consistência multi-instância
- [ ] Testes unitários: CircuitBreaker (todos os estados e transições)
- [ ] Testes de integração: freight-ai com circuit breaker ativo

---

## Fase 6: Checkout e Pedidos

- [ ] Criar schema Zod: `Order` (id, userId, itens, frete, total, status, createdAt)
- [ ] Criar service `orders`: criar pedido, buscar por usuário, atualizar status
- [ ] Criar rota `/checkout` com formulário de endereço + resumo do pedido
- [ ] Integrar `FreightCalculator` no checkout (frete da IA ou fallback)
- [ ] Criar campo de cupom de desconto com validação server-side
  - Rejeitar `ME_DA_DESCONTO_OU_O_GATINHO_CHORA` com mensagem amigável
  - Validar todos os cupons no backend (nunca no frontend apenas)
- [ ] Criar API Route `/api/checkout` (POST) com validação Zod completa
- [ ] Criar página de confirmação `/checkout/confirmacao/[orderId]`
- [ ] Criar tela de pedidos do usuário em `/admin`
- [ ] Testes E2E: fluxo completo de compra (happy path)
- [ ] Testes E2E: tentativa de cupom inválido / prompt injection no cupom

---

## Fase 7: Painel de Controle do Caos

- [ ] Criar `ChaosStore` (Zustand): experimento ativo, blast radius, métricas
- [ ] Criar API Route `/api/chaos/inject` (POST, apenas staging, requer role professor)
  - Tipos: `latency`, `error_500`, `timeout`, `unavailable`
  - Parâmetros: `target`, `delay`, `duration`, `blastRadius`
- [ ] Criar API Route `/api/chaos/stop` (POST)
- [ ] Criar API Route `/api/chaos/metrics` (GET): taxa de erro, tempo de resposta, conversão
- [ ] Criar rota `/chaos` (protegida por role)
- [ ] Criar componente `ChaosPanel`:
  - Formulário de configuração do experimento
  - Botão "Disparar Caos" / "Parar Experimento"
  - Status do experimento ativo
- [ ] Criar componente `BlastRadiusConfig` (slider: 1% a 100% dos usuários)
- [ ] Criar componente `MetricsDisplay` (gráficos em tempo real: SSE ou polling)
- [ ] Criar componente `ExperimentLog` (histórico de experimentos executados)
- [ ] Criar componente `SteadyStateDefinition` (configurar métricas de estado estável)
- [ ] Testes unitários: ChaosStore, validações de configuração
- [ ] Testes de componente: ChaosPanel com mocks de API

---

## Fase 8: Prompt Injection Testing

- [ ] Criar endpoint `/api/chaos/prompt-injection` (para demonstração em aula)
  - Recebe payload absurdo e mostra o que o guardrail bloqueou
  - Modo vulnerável (sem guardrail) vs modo seguro (com guardrail)
- [ ] Criar página `/chaos/prompt-injection` com demonstração interativa
  - Campo de input para alunos testarem payloads
  - Visualização do que o guardrail bloqueou
  - Comparação: sistema sem guardrail vs com guardrail
- [ ] Adicionar exemplos de payloads clássicos de prompt injection como casos de teste
- [ ] Testes unitários: guardrails de prompt injection (deve bloquear payloads maliciosos)

---

## Fase 9: Testes Automatizados Completos

- [ ] Cobertura mínima 80% nos services e hooks críticos
- [ ] Testes E2E: checkout normal (sem caos)
- [ ] Testes E2E: checkout com latência de 15s na IA (Circuit Breaker deve abrir)
- [ ] Testes E2E: checkout com API de frete em erro 500
- [ ] Testes E2E: prompt injection no campo de cupom
- [ ] Testes E2E: tentativa de acesso ao `/chaos` por usuário `aluno` (deve ser bloqueado)
- [ ] Teste de carga básico: 50 usuários simultâneos no checkout

---

## Fase 10: CI/CD com Chaos Stage

- [ ] Criar `.github/workflows/ci.yml` (build + lint + testes unitários)
- [ ] Criar `.github/workflows/chaos-testing.yml`:
  - Step 1: Deploy em homologação
  - Step 2: Definir steady state (taxa de erro < 5%, resposta < 3s)
  - Step 3: Injetar latência de 15s na API de frete via Gremlin ou simulação
  - Step 4: Rodar testes E2E de verificação (Cypress)
  - Step 5: Validar métricas (se taxa de erro > 5%, bloquear deploy)
  - Step 6: Se passou, deploy em produção
  - Step 7: Se falhou, notificar time e abortar
- [ ] Adicionar badge de status do chaos test no README
- [ ] Testar pipeline em um PR real

---

## Fase 11: Observabilidade e Monitoramento

- [ ] Configurar Sentry com source maps no Vercel
- [ ] Configurar Langfuse: logar todas as execuções do agente de frete
- [ ] Criar dashboard de métricas do Chaos GPT no Langfuse
- [ ] Configurar alertas: taxa de erro > 5% notifica via email
- [ ] Documentar como interpretar os logs nas notas de aula

---

## Fase 12: Deploy e Entrega

- [ ] Configurar projeto na Vercel com variáveis de ambiente
- [ ] Configurar Firebase Rules (Firestore e Storage)
- [ ] Configurar domínio (se aplicável)
- [ ] Seed do banco com capivaras de pelúcia de exemplo
- [ ] Criar usuários de demonstração: professor@demo.com, aluno@demo.com
- [ ] Revisão final de segurança: sem secrets no código, CORS configurado, rate limiting ativo
- [ ] Rodar checklist de deploy (`docs/DEPLOY.md`)
- [ ] Deploy final e smoke test em produção

---

## Em andamento

- [ ]

## Concluído

- [ ]
