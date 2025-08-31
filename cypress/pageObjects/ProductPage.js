export class ProductPage {
  addToCartFromCard(name) {
    const toRegex = (s) => {
      if (s.startsWith('/') && s.endsWith('/')) return new RegExp(s.slice(1, -1), 'i');
      const esc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/…/g, '(?:…|\\.{3})');
      return new RegExp(esc, 'i');
    };

    cy.contains('#product-list .card .text-dark', toRegex(name))
      .closest('.card')
      .should('be.visible')
      .within(() => {
        cy.get('.card-img-top').should('be.visible');
        cy.contains('button', 'Adicionar ao Carrinho').click();
      });
  }
}