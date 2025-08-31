export class CartPage {
  open() {
    cy.get('a[href="/cart.html"]').click();
    cy.url().should('include', '/cart.html');
    cy.get('#cart-list').should('be.visible');
  }

  shouldHaveItemById(id, qty = 1) {
    cy.get(`#cart-list button[data-product-id="${id}"]`)
      .should('exist')
      .closest('.cart-item')
      .within(() => {
        cy.contains(new RegExp(`Quantidade:\\s*${qty}\\b`)).should('exist');
      });
  }

  removeItemById(id) {
    cy.get(`#cart-list button[data-product-id="${id}"]`).click();
  }
}
