Cypress.Commands.add('addProductToCart', (productName) => {
  cy.contains('[data-testid="product-card"]', productName)
    .within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });
  cy.get('[data-testid="cart-counter"]').should('be.visible');
});

Cypress.Commands.add('goToCheckout', () => {
  cy.get('[data-testid="cart-button"]').click();
  cy.get('[data-testid="proceed-checkout"]').click();
});

Cypress.Commands.add('fillCheckout', (data) => {
  const d = { name:'Teste', email:'teste@teste.com', address:'Rua 1, 100',
              city:'SP', zip:'01001-000', payment:'pix', ...data };
  cy.get('[data-testid="name"]').clear().type(d.name);
  cy.get('[data-testid="email"]').clear().type(d.email);
  cy.get('[data-testid="address"]').clear().type(d.address);
  cy.get('[data-testid="city"]').clear().type(d.city);
  cy.get('[data-testid="zip"]').clear().type(d.zip);
  cy.get(`[data-testid="payment-${d.payment}"]`).click();
});