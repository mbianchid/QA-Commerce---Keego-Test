import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { HomePage } from "../../pageObjects/HomePage";
import { ProductPage } from "../../pageObjects/ProductPage";
import { CartPage } from "../../pageObjects/CartPage";
import { CheckoutPage } from "../../pageObjects/CheckoutPage";
import { AccountPage } from "../../pageObjects/AccountPage";

const home = new HomePage();
const product = new ProductPage();
const cart = new CartPage();
const checkout = new CheckoutPage();
const account = new AccountPage();
const genEmail = () => `qa+${Date.now()}@example.com`;

Given('que estou na página inicial', () => {
  cy.visit('/');
});

When('adiciono o produto {string} ao carrinho', (nome) => {
  const { ProductPage } = require('../../pageObjects/ProductPage');
  const product = new ProductPage();
  product.addToCartFromCard(nome);
});

When('abro o carrinho', () => {
  cart.open();
});

Then('devo ver no carrinho o item de id {int} com quantidade {int}', (id, qty) => {
  cart.shouldHaveItemById(id, qty);
});

Then('devo ver o item {string} no carrinho com quantidade {int}', (nome, qty) => {
  cart.shouldHaveItemByName(nome, qty);
});

When('removo do carrinho o item de id {int}', (id) => {
  cart.removeItemById(id);
});

Given('vou para o checkout', () => {
  cart.open();
  cart.proceedCheckout();
  cy.url().should('include', '/checkout');
});

When('preencho o checkout com dados válidos', () => {
  checkout.fill({});
});

When('finalizo a compra', () => {
  checkout.submit();
});

Then('devo ver a mensagem de sucesso do pedido', () => {
  checkout.shouldSeeSuccessMessage();
});

When('tento finalizar o checkout com {string} vazio', (campo) => {
  const vazio = { [campo]: '' };
  checkout.fill(vazio);
  checkout.submit();
});

When('vou para o checkout e preencho com dados válidos criando conta', () => {
  if (typeof cart.proceedCheckout === 'function') {
    cart.proceedCheckout();
  } else {
    cy.contains('a,button', /checkout|finalizar|fechar pedido/i).click({ force: true });
  }
  cy.url().should('match', /\/checkout(\.html)?/i);

  const email = genEmail();
  const password = 'Teste@123';
  cy.wrap({ email, password }).as('cred');

  checkout.fillValidData({
    email,
  });

  checkout.enableCreateAccount({ email, password });
});

When('clico em Minha conta', () => {
  cy.get('body').then(($b) => {
    const byHref = $b.find('a[href*="login"]').first();
    const byText = $b.find('a,button').filter((_i, el) =>
      /minha conta|login|acessar/i.test(el.innerText || '')
    ).first();

    if (byHref.length) cy.wrap(byHref).click({ force: true });
    else if (byText.length) cy.wrap(byText).click({ force: true });
    else cy.visit('/login.html');
  });

  cy.location('pathname', { timeout: 10000 }).should('match', /\/login(\.html)?$/i);
});

When('faço o login com dados válidos', () => {
  const email = Cypress.env('loginEmail');
  const password = Cypress.env('loginPassword') || 'Teste@123';

  if (!email) {
    throw new Error('Defina --env loginEmail=<seu_email> (e opcionalmente loginPassword)');
  }

  const typeFirstExisting = (cands, value) =>
    cy.document().then((doc) => {
      for (const s of cands) {
        try { if (doc.querySelector(s)) { cy.get(s).first().clear({force:true}).type(value, {force:true}); return; } } catch(e){}
      }
      throw new Error(`Nenhum seletor encontrado entre: ${cands.join(', ')}`);
    });

  typeFirstExisting(['#email','[name="email"]','input[type="email"]'], String(email));
  typeFirstExisting(['#password','[name="password"]','input[type="password"]'], String(password));

  cy.contains('button,[type="submit"],[data-testid="login"]', /entrar|login|acessar/i)
    .first()
    .click({ force: true });
});

When('sou direcionado para o dashboard', () => {
  cy.location('pathname', { timeout: 15000 }).should('match', /\/dashboard(\.html)?$/i);
});

When('clico no botão para alterar meu cadastro', () => {
  const openAccountSection = () => {
    cy.get('body').then(($b) => {
      const byText = $b.find('a,button,[role="tab"]').filter((_i, el) =>
        /minha conta|meu cadastro|perfil|dados|account|profile/i.test(el.innerText || '')
      ).first();
      if (byText.length) cy.wrap(byText).click({ force: true });
    });
  };

  openAccountSection();

  cy.get('body').then(($b) => {
    const editBtn = $b.find('button,a').filter((_i, el) =>
      /editar|alterar|atualizar dados|editar perfil|edit/i.test(el.innerText || '')
    ).first();
    if (editBtn.length) cy.wrap(editBtn).click({ force: true });
  });
});

When('coloco meus novos dados válidos', () => {
  const { AccountPage } = require('../../pageObjects/AccountPage');
  const account = new AccountPage();

  account.fillValidData({
    address: `Rua QA ${Date.now()}`,
    number: '101',
  });

  account.save();
});

Then('verifico a mensagem de sucesso', () => {
  const { AccountPage } = require('../../pageObjects/AccountPage');
  const account = new AccountPage();
  account.shouldSeeSuccess();
});

When('faço login com a conta criada', () => {
  cy.get('@cred').then(({ email, password }) => {
    const { LoginPage } = require('../../pageObjects/LoginPage');
    const login = new LoginPage();

    login.open();
    login.login(email, password);
  });
});

Then('devo ver a mensagem de erro para {string}', (campo) => {
  checkout.errorByTestId(campo).should('be.visible');
});

Given('acesso minha conta', () => {
  const { AccountPage } = require('../../pageObjects/AccountPage');
  const account = new AccountPage();
  account.open();
});

  When('altero meus dados com dados válidos', () => {
  const { AccountPage } = require('../../pageObjects/AccountPage');
  const account = new AccountPage();

  account.open();

  account.fillValidData({
    name: `QA Tester ${Date.now()}`,
    email: `qa+${Date.now()}@example.com`,
  });

  account.save();
});

When('altero meu cadastro com nome {string} e email {string}', (nome, email) => {
  account.editProfile({ name: nome, email });
});

Then('devo ver a mensagem de sucesso do cadastro', () => {
  const { AccountPage } = require('../../pageObjects/AccountPage');
  const account = new AccountPage();
  account.shouldSeeSuccess();
});

Then('devo ver o aviso de sucesso de atualização', () => {
  account.toast().should('be.visible');
});

When('vou para o checkout e preencho com dados válidos', () => {
  if (typeof cart.proceedCheckout === 'function') {
    cart.proceedCheckout();
  } else {
    cy.contains('a,button', /checkout|finalizar|fechar pedido/i).click({ force: true });
  }

  cy.url().should('match', /\/checkout(\.html)?/i);

  checkout.fillValidData();
});
