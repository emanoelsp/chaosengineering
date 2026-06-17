# Arquitetura

## Stack principal

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase Auth
- Firestore
- Firebase Storage (se necessário)
- Vercel

## Bibliotecas recomendadas

- Zod para validação
- React Hook Form para formulários
- TanStack Query para cache e estado assíncrono
- Zustand para estado global simples
- Sentry para monitoramento de erros
- PostHog para analytics
- Resend para e-mails
- Stripe para pagamentos (se necessário)
- Toastify para retorno de ações básicas
- SweetAlert2 para ações complexas que precisam de confirmação

## Estrutura sugerida

```txt
/src
  /app
  /components
    /ui
    /shared
    /features
  /features
  /lib
  /hooks
  /schemas
  /services
  /types
  /stores
  /tests
/firebase
/cypress
/docs
```

## Regras técnicas

- Preferir Server Components quando possível.
- Usar Client Components apenas quando necessário.
- Separar lógica de UI.
- Validar dados com Zod.
- Nunca acessar Firestore diretamente em componentes complexos.
- Centralizar configuração Firebase em `/src/lib/firebase`.
- Criar services para operações de banco.
