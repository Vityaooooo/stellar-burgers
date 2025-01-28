import { TIngredient } from '@utils-types';

type TIngredientState = {
  ingredients: Array<TIngredient>;
  error: string | null;
  loading: boolean;
};

export const ingredientInitialState: TIngredientState = {
  ingredients: [],
  error: null,
  loading: false
};
