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

Given('que estou na página inicial', () => {
  cy.visit('/');
});

When('adiciono o produto {string} ao carrinho', (nome) => {
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
  checkout.successMessage().should('be.visible');
});

When('tento finalizar o checkout com {string} vazio', (campo) => {
  const vazio = { [campo]: '' };
  checkout.fill(vazio);
  checkout.submit();
});

Then('devo ver a mensagem de erro para {string}', (campo) => {
  checkout.errorByTestId(campo).should('be.visible');
});

Given('acesso minha conta', () => {
  account.open();
});

When('altero meu cadastro com nome {string} e email {string}', (nome, email) => {
  account.editProfile({ name: nome, email });
});

Then('devo ver o aviso de sucesso de atualização', () => {
  account.toast().should('be.visible');
});
