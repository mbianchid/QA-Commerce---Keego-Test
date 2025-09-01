export class LoginPage {
  open() {
    cy.visit('/login.html');
    cy.url().should('include', '/login');
  }

login(email, password = 'Teste@123') {
  const resolve = (cands) =>
    cy.get('body').then(($b) => cands.find((s) => $b.find(s).length > 0) || null);

  cy.then(() => resolve(['#email', '[name="email"]', 'input[type="email"]'])).then((sel) => {
    expect(sel, 'email selector').to.be.a('string');
    cy.get(sel).clear({ force: true }).type(email, { force: true });
  });

  cy.then(() => resolve(['#password', '[name="password"]', '#password'])).then((sel) => {
    expect(sel, 'password selector').to.be.a('string');
    cy.get(sel).clear({ force: true }).type(password, { force: true });
  });

  cy.contains('button,[type="submit"],[data-testid="login"]', /entrar|login|acessar/i)
    .first()
    .click({ force: true });

  cy.location('pathname', { timeout: 15000 }).should((p) => {
    const ok = /\/(dashboard|minha-conta|index)\.html$/i.test(p);
    expect(ok, `redirected path = ${p}`).to.be.true;
  });
  }
}
