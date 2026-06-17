import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
    env: {
      PROFESSOR_EMAIL: 'professor@demo.com',
      PROFESSOR_PASSWORD: 'demo123456',
      ALUNO_EMAIL: 'aluno@demo.com',
      ALUNO_PASSWORD: 'demo123456',
    },
  },
})
