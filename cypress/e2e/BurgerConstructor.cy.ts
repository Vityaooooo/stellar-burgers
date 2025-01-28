describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.intercept('GET', 'ingredients', { fixture: 'ingredients.json'});
  });

  it('should add ingredient to constructor', () => {
    cy.get('[data-cy="ingredient-item"]').contains('p', /Булка/i).first().parent().parents('[data-cy="ingredient-item"]').as('bunIngredient');
    cy.get('@bunIngredient').find('button').click();

    cy.get('[data-cy="constructor-bun-top"]').contains('span').should('contain', /Булка/i);
    cy.get('[data-cy="constructor-bun-bottom"]').contains('span').should('contain', /Булка/i);

    cy.get('[data-cy="ingredient-item"]').contains('p', /котлета/i).first().parent().parents('[data-cy="ingredient-item"]').as('mainIngredient');
    cy.get('@mainIngredient').find('button').click();

    cy.get('[data-cy="ingredient-item"]').contains('p', /соус/i).first().parent().parents('[data-cy="ingredient-item"]').as('sauceIngredient');
    cy.get('@sauceIngredient').find('button').click();

    cy.get('[data-cy="constructor-main"]').children().should('have.length', 2);
  });

  it('should open and close the modal window for ingredient details', () => {
    cy.get('[data-cy="ingredient-item"]').get('[data-cy="ingredient-item-link"]').first().click();

    cy.get('[data-cy="modal"]').should('exist').and('contain', 'Детали ингредиента');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('should display details for the correct ingredient in the modal', () => {
    cy.get('[data-cy="ingredient-item"]').first().as('ingredientItem');
    cy.get('@ingredientItem').find('.text_type_main-default').invoke('text').as('ingredientName');

    cy.get('@ingredientItem').click();

    cy.get('@ingredientName').then((ingredientName) => {
      cy.get('[data-cy="modal"]').should('contain', ingredientName);
    });
  });

  describe('Check correct order proccedure', () => {
    afterEach(() => {
      cy.clearCookie('accessToken');
      window.localStorage.removeItem('refreshToken');
    });

    it('should log in, add ingredients to the constructor, and place an order', () => {
      cy.visit('http://localhost:4000/login');
    
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
    
      cy.get('[data-cy="ingredient-item"]').contains('p', /Булка/i).first().parent().parents('[data-cy="ingredient-item"]').as('bunIngredient');
      cy.get('@bunIngredient').find('button').click({ force: true });
    
      cy.get('[data-cy="ingredient-item"]').contains('p', /котлета/i).first().parent().parents('[data-cy="ingredient-item"]').as('mainIngredient');
      cy.get('@mainIngredient').find('button').click({ force: true });
    
      cy.get('[data-cy="ingredient-item"]').contains('p', /соус/i).first().parent().parents('[data-cy="ingredient-item"]').as('sauceIngredient');
      cy.get('@sauceIngredient').find('button').click({ force: true });
    
      cy.get('[data-cy="constructor-main"]').children().should('have.length', 2);
    
      cy.contains('button', 'Оформить заказ').click();
    
      cy.wait('@postOrder').then(({ response }) => {
        const orderNumber = response?.body?.order?.number;
        expect(orderNumber).to.eq('12345');
      });
      
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="order-number"]').should('contain', '12345');
  
      cy.get('[data-cy="modal-close"]').click();
    
      cy.get('[data-cy="constructor-main"]').children().should('have.length', 1);
      cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Выберите булки');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Выберите булк');
    });  
  });
})