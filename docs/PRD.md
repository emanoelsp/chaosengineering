# PRD - Chaos GPT

## Tipo de projeto

Sistema Web com Agente de IA

---

## Objetivo

Construir uma plataforma educacional de e-commerce em Next.js que sirva como campo de batalha vivo para ensinar **Engenharia do Caos com IA**. O sistema é funcional (vende capivaras de pelúcia) e possui uma camada de IA para cálculo de frete dinâmico. Professores e alunos usam o **Painel de Controle do Caos** para injetar falhas reais e observar como padrões de resiliência (Circuit Breaker, Fallback, Guardrails) mantêm o sistema de pé.

---

## Público-alvo

- Professores de engenharia de software ensinando testes e resiliência
- Alunos de cursos de desenvolvimento full-stack
- Times de engenharia querendo aprender Chaos Engineering na prática

---

## Problema que resolve

Alunos aprendem testes unitários e E2E em sistemas ideais. O problema é que sistemas reais falham de formas que testes tradicionais de caixa-preta não detectam: a API de terceiros some, a IA retorna outputs absurdos, um payload malicioso passa pela validação. O Chaos GPT cria um ambiente controlado onde **quebrar o sistema de propósito é o objetivo**.

---

## Funcionalidades principais

### E-commerce (o sistema que será quebrado)

- [x] Autenticação (aluno / professor / admin)
- [ ] Listagem de produtos (capivaras de pelúcia com estoque)
- [ ] Carrinho de compras com state persistido
- [ ] Cálculo de frete via agente de IA (Claude)
- [ ] Aplicação de cupom de desconto
- [ ] Checkout e confirmação de pedido
- [ ] Dashboard do aluno (pedidos, histórico)

### Painel de Controle do Caos (apenas para professores)

- [ ] Injetar latência na API de frete (0–30s configurável)
- [ ] Simular erro 500 na API de frete
- [ ] Simular indisponibilidade total da API de frete
- [ ] Configurar Blast Radius (% de usuários afetados)
- [ ] Visualizar métricas em tempo real (taxa de erro, tempo de resposta, conversão)
- [ ] Ativar/desativar Circuit Breaker manualmente
- [ ] Log de experimentos de caos executados

### Padrões de Resiliência (visíveis na UI)

- [ ] Circuit Breaker com estados visuais: Closed (verde) / Open (vermelho) / Half-Open (amarelo)
- [ ] Banner de fallback quando o frete fixo está ativo
- [ ] Guardrails na IA: rejeitar outputs malformados ou fora do domínio
- [ ] Timeout configurável na chamada à IA

### CI/CD com Caos

- [ ] Pipeline GitHub Actions com etapa de chaos testing
- [ ] Deploy automático bloqueado se o sistema não sobreviver ao caos
- [ ] Relatório de experimentos no PR

---

## Requisitos funcionais

- **RF001:** O usuário deve conseguir adicionar produtos ao carrinho e finalizar a compra mesmo quando a API de frete de IA estiver indisponível (fallback: frete fixo R$ 10,00).
- **RF002:** O Circuit Breaker deve abrir após 3 falhas consecutivas na API de frete e fechar automaticamente após 30s sem novas chamadas.
- **RF003:** O Painel de Caos deve estar disponível apenas para usuários com role `professor` ou `admin`.
- **RF004:** Todo input enviado à IA (frete, cupom) deve passar por validação Zod antes de chegar ao agente.
- **RF005:** A IA não deve aceitar instruções fora do domínio de cálculo de frete (guardrail de prompt injection).
- **RF006:** Todos os experimentos de caos devem ser logados com: tipo, duração, blast radius, impacto nas métricas.
- **RF007:** O pipeline CI/CD deve executar o experimento de caos padrão em homologação e bloquear o deploy se a taxa de erro subir acima de 5%.
- **RF008:** O cupom `ME_DA_DESCONTO_OU_O_GATINHO_CHORA` deve ser rejeitado pela validação de backend (demonstração de falha e correção).

---

## Requisitos não funcionais

- Checkout deve ser concluído em menos de 3s no estado estável (steady state)
- Taxa de conversão do carrinho deve permanecer acima de 95% mesmo com caos ativo e Circuit Breaker aberto
- O agente de IA deve responder em menos de 2s em condições normais
- Timeout máximo de 5s para chamadas à API de IA antes de ativar fallback
- Código TypeScript estrito em todo o projeto
- Cobertura de testes: mínimo 80% para services e hooks críticos
- Deploy na Vercel com preview por PR
- Logs de execução da IA via Langfuse

---

## Critérios de aceite

- Com o Circuit Breaker fechado (normal): o usuário finaliza a compra com frete calculado pela IA em menos de 3s.
- Com a API de frete simulando latência de 15s: o Circuit Breaker abre, o banner de fallback aparece e o usuário finaliza a compra com frete fixo de R$ 10,00 em menos de 3s.
- Com a API de frete com erro 500: o comportamento é idêntico ao cenário anterior.
- Com prompt injection no cupom: o sistema rejeita o input com mensagem de erro amigável e não zera o carrinho.
- Pipeline CI/CD: o deploy para produção só acontece depois que o sistema sobreviver ao experimento de caos padrão em homologação.
- O build deve passar sem erros de TypeScript ou lint.
- Os testes E2E de checkout (normal e com caos) devem passar.
