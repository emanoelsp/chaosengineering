describe('Checkout com Caos — Circuit Breaker', () => {
  before(() => {
    // Injeta latência de 15s na API de frete antes dos testes
    cy.request('POST', '/api/chaos/inject', {
      type: 'latency',
      target: 'api-frete-ia',
      delayMs: 15000,
      durationMs: 120000,
      blastRadius: 100,
    })
  })

  after(() => {
    cy.request('POST', '/api/chaos/stop')
  })

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(Cypress.env('ALUNO_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('ALUNO_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/loja')
  })

  it('deve ativar fallback quando API de frete está lenta', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="go-to-checkout"]').click()
    cy.get('[data-testid="cep-input"]').type('01310100')
    cy.get('[data-testid="calculate-freight"]').click()

    // O sistema deve ativar o fallback antes de 10s (não esperar os 15s da latência)
    cy.get('[data-testid="fallback-banner"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="freight-value"]').should('contain', 'R$ 10,00')
  })

  it('deve permitir finalizar compra mesmo com API de frete indisponível', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="go-to-checkout"]').click()
    cy.get('[data-testid="cep-input"]').type('01310100')
    cy.get('[data-testid="calculate-freight"]').click()

    cy.get('[data-testid="fallback-banner"]', { timeout: 10000 }).should('be.visible')

    // Preenche endereço e finaliza
    cy.get('[data-testid="endereco-rua"]').type('Av. Paulista')
    cy.get('[data-testid="endereco-numero"]').type('1000')
    cy.get('[data-testid="endereco-bairro"]').type('Bela Vista')
    cy.get('[data-testid="endereco-cidade"]').type('São Paulo')
    cy.get('[data-testid="endereco-estado"]').type('SP')
    cy.get('[data-testid="confirm-order"]').click()

    // Deve chegar na página de confirmação, nunca travar
    cy.url({ timeout: 15000 }).should('include', '/checkout/confirmacao')
  })

  it('sistema não deve exibir tela branca com API indisponível', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="go-to-checkout"]').click()
    cy.get('body').should('not.be.empty')
    cy.get('[data-testid="checkout-container"]').should('be.visible')
  })
})
