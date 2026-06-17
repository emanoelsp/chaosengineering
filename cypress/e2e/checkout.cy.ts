describe('Checkout — Happy Path', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(Cypress.env('ALUNO_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('ALUNO_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/loja')
  })

  it('deve adicionar produto ao carrinho e visualizar total', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="cart-count"]').should('contain', '1')
  })

  it('deve calcular frete e exibir total no checkout', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="go-to-checkout"]').click()
    cy.get('[data-testid="cep-input"]').type('01310100')
    cy.get('[data-testid="calculate-freight"]').click()
    cy.get('[data-testid="freight-value"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="order-total"]').should('be.visible')
  })

  it('deve rejeitar cupom inválido com mensagem amigável', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click()
    })
    cy.get('[data-testid="go-to-checkout"]').click()
    cy.get('[data-testid="coupon-input"]').type('ME_DA_DESCONTO_OU_O_GATINHO_CHORA')
    cy.get('[data-testid="apply-coupon"]').click()
    cy.get('[data-testid="coupon-error"]').should('contain', 'inválido')
    cy.get('[data-testid="order-total"]').should('not.contain', 'R$ 0,00')
  })
})
