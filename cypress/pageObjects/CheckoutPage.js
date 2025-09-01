export class CheckoutPage {
  fillValidData(data = {}) {
    const defaults = {
      firstName: 'QA',
      lastName: 'Tester',
      address: 'Rua 1',
      number: '100',
      cep: '01001000',
      email: 'qa@example.com',
      paymentMethod: 'pix',
    };
    const d = { ...defaults, ...data };

    const fill = (cands, value) => {
      cy.get('body').then(($b) => {
        const sel = cands.find((s) => $b.find(s).length > 0);
        if (!sel) {
          cy.log('Campo não encontrado (ok se não existir neste layout):', cands.join(' | '));
          return;
        }
        cy.get(sel).should('be.visible').clear({ force: true }).type(String(value), { force: true });
      });
    };

    fill(['#first-name', '[name="#first-name"]', 'input[placeholder*="Nome" i]', 'input[placeholder*="Nome" i]'], d.firstName);
    fill(['#last-name', '[name="#last-name"]', 'input[placeholder*="Sobrenome" i]'], d.lastName);
    fill(['#address', '[name="address"]', 'input[placeholder*="Endereço" i]'], d.address);
    fill(['#number', '[name="number"]', 'input[placeholder*="Número" i]'], d.number);
    fill(['#cep', '[name="cep"]', 'input[placeholder*="CEP" i]'], d.cep);
    fill(['#email', '[name="email"]', 'input[type="email"]'], d.email);

    cy.get('body').then(($b) => {
      if ($b.find('input[name="paymentMethod"][value="pix"]').length) {
        cy.get('input[name="paymentMethod"][value="pix"]').check({ force: true });
      } else if ($b.find('select[name="paymentMethod"]').length) {
        cy.get('select[name="paymentMethod"]').select(d.paymentMethod, { force: true });
      } else {
        cy.contains('label,button', /pix/i).click({ force: true });
      }
      cy.get('#terms').click();
    });
  }

  submit() {
    cy.intercept('POST', '**/api/checkout').as('checkout');

    cy.contains('button,[type="submit"],[data-testid="finish-checkout"]', /finalizar|pedido|checkout|compr(a|o)/i)
      .first()
      .click({ force: true });

    cy.wait('@checkout', { timeout: 15000 }).then((int1) => {
    const code = int1?.response?.statusCode;

    if (code && [200, 201].includes(code)) {
      return;
    }

    cy.location('href', { timeout: 15000 }).should('match', /\/status\.html\?orderId=\d+/);

    cy.location('search').then((search) => {
        const params = new URLSearchParams(search);
        const orderId = params.get('orderId');
        if (orderId) {
          cy.request({ method: 'GET', url: `/api/orders/${orderId}`, failOnStatusCode: false })
            .its('status')
            .should((s) => expect([200, 201]).to.include(s));
        }
      });
    });
  }

  shouldSeeSuccessMessage() {
    const known = ['[data-testid="order-success"]', '.alert-success', '#success-message'];
    cy.get('body').then(($b) => {
      const anyKnown = known.find((s) => $b.find(s).length);
      if (anyKnown) {
        cy.get(anyKnown).should('be.visible');
      } else {
        cy.contains(/(pedido|compra).*(sucesso|confirmad[oa])|obrigado|order\s*(success|confirmed)/i)
          .should('be.visible');
        cy.get('.container').should('be.visible');
      }
    });
  }

enableCreateAccount({ email, password = 'Pass123@', confirmPassword } = {}) {
  const pass = password || 'Pass123@';
  const confirm = confirmPassword || pass;

  cy.get('body').then(($b) => {
    if ($b.find('input[name="createAccount"]').length) {
      cy.get('input[name="createAccount"]').check({ force: true });
    } else {
      cy.contains(/criar (uma )?conta/i).click({ force: true });
    }
  });

  if (email) {
    const candidatesEmail = ['#email', '[name="email"]', 'input[type="email"]'];
    const selEmail = candidatesEmail.find((s) => Cypress.$(s).length);
    if (selEmail) cy.get(selEmail).clear({ force: true }).type(email, { force: true });
  }

  cy.get('body').then(($b) => {
    const pwdSel =
      ($b.find('#password').length && '#password') ||
      ($b.find('[name="password"]').length && '[name="password"]') ||
      null;
    if (pwdSel) cy.get(pwdSel).clear({ force: true }).type(pass, { force: true });

    const confirmSel =
      ($b.find('#confirm-password').length && '#confirm-password') ||
      ($b.find('[name="confirm-password"]').length && '[name="confirm-password"]') ||
      null;
    if (confirmSel) cy.get(confirmSel).clear({ force: true }).type(confirm, { force: true });
  });
  }
}
