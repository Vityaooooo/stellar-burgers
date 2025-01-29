
declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientReg: RegExp): void;
  }
}

describe('Burger Constructor Tests', () => {
  const URL = 'http://localhost:4000/';

  const bunReg = /Булка/i;
  const sauseReg = /Соус/i;
  const mainReg = /Котлета/i;

  const ingredientDataAttribute = 'ingredient-item';
  const modalDataAttribute = 'modal';
  const constructorMainDataAttribute = 'constructor-main';
  const constructorBunDataAttribute = 'constructor-bun';

  Cypress.Commands.add('addIngredient', (ingredientReg) => {
    cy.get(`[data-cy="${ingredientDataAttribute}"]`).contains('p', ingredientReg).first().parent().parents(`[data-cy="${ingredientDataAttribute}"]`).as('ingredient');
    cy.get('@ingredient').find('button').click();
  })

  beforeEach(() => {
    cy.visit(URL);
    cy.intercept('GET', 'ingredients', { fixture: 'ingredients.json'});
  });

  it('should add ingredient to constructor', () => {
    cy.addIngredient(bunReg);

    cy.addIngredient(mainReg);

    cy.addIngredient(sauseReg);

    cy.get(`[data-cy="${constructorBunDataAttribute}-top"]`).should('contain', 'булка');
    cy.get(`[data-cy="${constructorBunDataAttribute}-bottom"]`).should('contain', 'булка');
    cy.get(`[data-cy="${constructorMainDataAttribute}"]`).children().should('have.length', 2);
  });

  it('should open and close the modal window for ingredient details', () => {
    cy.get(`[data-cy="${ingredientDataAttribute}"]`).get(`[data-cy="${ingredientDataAttribute}-link"]`).first().click();

    cy.get(`[data-cy="${modalDataAttribute}"]`).should('exist').and('contain', 'Детали ингредиента');

    cy.get(`[data-cy="${modalDataAttribute}-close"]`).click();
    cy.get(`[data-cy="${modalDataAttribute}"]`).should('not.exist');
  });

  it('should display details for the correct ingredient in the modal', () => {
    cy.get(`[data-cy="${ingredientDataAttribute}"]`).first().as('ingredientItem');
    cy.get('@ingredientItem').find('.text_type_main-default').invoke('text').as('ingredientName');

    cy.get('@ingredientItem').click();

    cy.get('@ingredientName').then((ingredientName) => {
      cy.get(`[data-cy="${modalDataAttribute}"]`).should('contain', ingredientName);
    });
  });

  describe('Check correct order proccedure', () => {
    afterEach(() => {
      cy.clearCookie('accessToken');
      window.localStorage.removeItem('refreshToken');
    });

    it('should log in, add ingredients to the constructor, and place an order', () => {
      cy.visit(URL + 'login');
    
      cy.get('[data-cy="email-input-container"]').find('input').type('testuser@example.com');
    
      cy.get('[data-cy="password-input-container"]').find('input').type('password123');
    
      cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' }).as('loginRequest');
    
      cy.get('[data-cy="login-button-container"]').find('button').click();
    
      cy.wait('@loginRequest').then(({ response }) => {
        const { accessToken, refreshToken } = response?.body;
        cy.setCookie('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
      });
  
      cy.getCookie('accessToken').should('have.property', 'value', 'mockAccessToken');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('refreshToken')).to.eq('mockRefreshToken');
      });  

      cy.intercept('POST', 'orders', { fixture: 'order.json' }).as('postOrder');

      cy.addIngredient(bunReg);

      cy.addIngredient(mainReg);

      cy.addIngredient(sauseReg);
    
    
      cy.get('[data-cy="constructor-main"]').children().should('have.length', 2);
    
      cy.contains('button', 'Оформить заказ').click();
    
      cy.wait('@postOrder').then(({ response }) => {
        const orderNumber = response?.body?.order?.number;
        expect(orderNumber).to.eq('12345');
      });
      
      cy.get(`[data-cy="${modalDataAttribute}"]`).should('exist');
      cy.get('[data-cy="order-number"]').should('contain', '12345');
  
      cy.get(`[data-cy="${modalDataAttribute}-close"]`).click();
    
      cy.get(`[data-cy="${constructorMainDataAttribute}"]`).children().should('have.length', 1);
      cy.get(`[data-cy="${constructorBunDataAttribute}-top"]`).should('contain', 'Выберите булки');
      cy.get(`[data-cy="${constructorBunDataAttribute}-bottom"]`).should('contain', 'Выберите булки');
    });  
  });
})