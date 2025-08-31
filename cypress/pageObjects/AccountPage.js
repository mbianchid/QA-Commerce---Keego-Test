export class AccountPage {
  open() { cy.visit('/minha-conta'); }
  editProfile(data) {
    if (data.name) cy.get('[data-testid="acc-name"]').clear().type(data.name);
    if (data.email) cy.get('[data-testid="acc-email"]').clear().type(data.email);
    cy.get('[data-testid="acc-save"]').click();
  }
  toast() { return cy.get('[data-testid="toast-success"]'); }
}
