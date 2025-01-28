import { TConstructorIngredient } from '@utils-types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  indgredients: Array<TConstructorIngredient>;
};

export const burgerConstructorInitialState: TBurgerConstructorState = {
  indgredients: [],
  bun: null
};

export const mockNanoId = 'test-id';
