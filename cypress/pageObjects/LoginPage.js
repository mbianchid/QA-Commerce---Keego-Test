// cypress/pageObjects/LoginPage.js
export class LoginPage {
  open() {
    cy.visit('/login.html');
    cy.url().should('include', '/login');
  }

  login(email, password = 'Teste@123') {
    const emailSel =
      (Cypress.$('#email').length && '#email') ||
      (Cypress.$('[name="email"]').length && '[name="email"]') ||
      'input[type="email"]';

    const pwdSel =
      (Cypress.$('#password').length && '#password') ||
      (Cypress.$('[name="password"]').length && '[name="password"]') ||
      'input[type="password"]';

    cy.get(emailSel).clear({ force: true }).type(email, { force: true });
    cy.get(pwdSel).clear({ force: true }).type(password, { force: true });

    cy.contains('button,[type="submit"],[data-testid="login"]', /entrar|login|acessar/i)
      .first()
      .click({ force: true });

    // Sinal de que logou: aparece "Minha Conta" ou "Sair" no header, ou redireciona
    cy.get('body').then(($b) => {
      if ($b.find('a[href*="minha-conta"]').length) {
        cy.contains('a', /minha conta/i).should('be.visible');
      } else {
        cy.contains(/sair|logout/i).should('be.visible');
      }
    });
  }
}
