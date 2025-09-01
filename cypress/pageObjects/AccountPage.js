// cypress/pageObjects/AccountPage.js
export class AccountPage {
  open() {
    cy.visit('/login.html');
    cy.url().should('include', '/login');
  }

  /** Preenche o formulário de cadastro com dados válidos (seletores flexíveis) */
  fillValidData(data = {}) {
    const d = {
      firstName: 'QA',
      lastName: 'Tester',
      address: 'Rua 1',
      number: '100',
      cep: '01001000',
      email: 'qa@example.com',
      ...data,
    };

    const fill = (cands, value) => {
      cy.get('body').then(($b) => {
        const sel = cands.find((s) => $b.find(s).length > 0);
        if (!sel) return;
        cy.get(sel).should('be.visible').clear({ force: true }).type(String(value), { force: true });
      });
    };

    fill(['#firstName', '[name="firstName"]', 'input[placeholder*="Primeiro" i]', 'input[placeholder*="Nome" i]'], d.firstName);
    fill(['#lastName', '[name="lastName"]', 'input[placeholder*="Sobrenome" i]'], d.lastName);
    fill(['#address', '[name="address"]', 'input[placeholder*="Endereço" i]'], d.address);
    fill(['#number', '[name="number"]', 'input[placeholder*="Número" i]'], d.number);
    fill(['#cep', '[name="cep"]', 'input[placeholder*="CEP" i]'], d.cep);
    fill(['#email', '[name="email"]', 'input[type="email"]'], d.email);
  }

  save() {
    cy.contains('button,[type="submit"],[data-testid="save-profile"]', /salvar|atualizar|gravar|confirmar/i)
      .first()
      .click({ force: true });
  }

  shouldSeeSuccess() {
    const known = ['[data-testid="profile-success"]', '.alert-success', '#success-message'];
    cy.get('body').then(($b) => {
      const anyKnown = known.find((s) => $b.find(s).length);
      if (anyKnown) {
        cy.get(anyKnown).should('be.visible');
      } else {
        cy.contains(/(dados|perfil|cadastro).*(salv|atualizad|sucesso)/i).should('be.visible');
      }
    });
  }
}
