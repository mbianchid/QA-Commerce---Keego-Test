export class HomePage {
  visit() { cy.visit('/'); }
  search(term) {
    cy.get('[data-testid="search-input"]').clear().type(term);
    cy.get('[data-testid="search-submit"]').click();
  }
  productCardBy(name) {
    return cy.contains('[data-testid="product-card"]', name);
  }
}
