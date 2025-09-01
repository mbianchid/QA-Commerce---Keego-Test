export class AccountPage {
  open() {
    cy.location('pathname').then((p) => {
      if (!/\/dashboard(\.html)?$/i.test(p)) cy.visit('/dashboard.html');
    });
    this._revealAccountSection();
    this._ensureEditFormVisible();
  }

  openMyAccount() { return this.open(); }

  _resolveSelector(cands) {
    return cy.document().then((doc) => {
      for (const s of cands) {
        try { if (doc.querySelector(s)) return s; } catch (_) {}
      }
      return null;
    });
  }

  _findByLabel(keywords = []) {
    const keys = (keywords || []).map((k) => k.toLowerCase());
    return cy.document().then((doc) => {
      const labels = Array.from(doc.querySelectorAll('label'));
      for (const lb of labels) {
        const txt = (lb.textContent || '').toLowerCase();
        if (keys.some((k) => txt.includes(k))) {
          if (lb.htmlFor) {
            const el = doc.getElementById(lb.htmlFor);
            if (el) return el;
          }
          const el = lb.querySelector('input,textarea,select');
          if (el) return el;
        }
      }
      return null;
    });
  }

  _findByAttr(keywords = []) {
    const keys = (keywords || []).map((k) => k.toLowerCase());
    return cy.document().then((doc) => {
      const els = Array.from(doc.querySelectorAll('input,textarea,select'));
      for (const el of els) {
        const nm = (el.getAttribute('name') || '').toLowerCase();
        const id = (el.getAttribute('id') || '').toLowerCase();
        const al = (el.getAttribute('aria-label') || '').toLowerCase();
        if (keys.some((k) => nm.includes(k) || id.includes(k) || al.includes(k))) return el;
      }
      return null;
    });
  }

  _fill(selectorCands, value, keywords = []) {
    return this._resolveSelector(selectorCands).then((sel) => {
      if (sel) {
        cy.get(sel).first().should('be.visible').clear({ force: true }).type(String(value), { force: true });
        return;
      }
      return this._findByLabel(keywords).then((el) => {
        if (el) {
          cy.wrap(el).should('be.visible').clear({ force: true }).type(String(value), { force: true });
          return;
        }
        return this._findByAttr(keywords).then((el2) => {
          if (el2) cy.wrap(el2).should('be.visible').clear({ force: true }).type(String(value), { force: true });
          else cy.log('Campo não encontrado para', keywords.join('|'));
        });
      });
    });
  }

  _revealAccountSection() {
    const textRe = /minha conta|meu cadastro|perfil|dados|account|profile/i;
    cy.get('body').then(($b) => {
      const target =
        $b.find('a,button,[role="tab"]').filter((_i, el) => textRe.test(el.innerText || '')).first();
      if (target.length) cy.wrap(target).click({ force: true });
    });
  }

  _ensureEditFormVisible() {
    cy.get('body').then(($b) => {
      const hasSave =
        $b.find('#update-account-button').length ||
        $b.find('button[type="submit"], [data-testid="save-profile"]').length;
      if (!hasSave) {
        const editBtn = $b.find('button,a').filter((_i, el) =>
          /editar|alterar|atualizar dados|editar perfil|edit/i.test(el.innerText || '')
        ).first();
        if (editBtn.length) cy.wrap(editBtn).click({ force: true });
      }
    });
  }

  fillValidData(data = {}) {
    const d = {
      name: `QA Tester ${Date.now()}`,
      email: `qa+${Date.now()}@example.com`,
      password: '',
      ...data,
    };
    this._fill(['#firstName','[name="firstName"]'], d.firstName, ['primeiro','nome','first']);
    this._fill(['#lastName', '[name="lastName"]' ], d.lastName,  ['sobrenome','last']);
    this._fill(['#address',  '[name="address"]'  ], d.address,   ['endereço','endereco','rua','logradouro','address']);
    this._fill(['#number',   '[name="number"]'   ], d.number,    ['número','numero','nº','number']);
    this._fill(['#cep',      '[name="cep"]'      ], d.cep,       ['cep','postal','zip']);
    this._fill(['#email',    '[name="email"]'    ], d.email,     ['email','e-mail']);
  }

  save() {
    this._ensureEditFormVisible();
    cy.get('body').then(($b) => {
      if ($b.find('#update-account-button').length) {
        cy.get('#update-account-button')
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      } else {
        cy.contains('button,[type="submit"]', /atualizar|salvar|gravar|confirmar/i)
          .first()
          .scrollIntoView()
          .click({ force: true });
      }
    });
  }

  shouldSeeSuccess() {
    const known = ['[data-testid="profile-success"]','.alert-success','#success-message','#update-success'];
    cy.get('body', { timeout: 10000 }).then(($b) => {
      const sel = known.find((s) => $b.find(s).length);
      if (sel) cy.get(sel).should('be.visible');
      else cy.contains(/(dados|perfil|cadastro).*(salv|atualizad|sucesso)|atualização realizada|updated successfully/i, { timeout: 10000 })
        .should('be.visible');
    });
  }

  waitForForm() {
    cy.get('body').then(($b) => {
      if (!$b.find('#name, #email').length) {
        this._ensureEditFormVisible();
      }
    });
    return cy.get('#name, #email', { timeout: 15000 }).should('be.visible');
  }
}
