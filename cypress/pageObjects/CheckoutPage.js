export class CheckoutPage {
  fill(data) {
    cy.fillCheckout(data);
  }
  submit() { cy.get('[data-testid="submit-order"]').click(); }
  successMessage() { return cy.get('[data-testid="order-success"]'); }
  errorByTestId(id) { return cy.get(`[data-testid="error-${id}"]`); }
}
