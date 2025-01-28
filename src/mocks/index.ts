export * from './constructor';
export * from './feed';
export * from './ingredients';
export * from './order';
export * from './orders';
export * from './user';

export const emptyAction = { type: '' };

export const mockIngredientBun = {
  _id: '1',
  name: 'mock-bun',
  type: 'bun',
  proteins: 100,
  fat: 100,
  carbohydrates: 100,
  calories: 100,
  price: 100,
  image: 'mock-image',
  image_large: 'mock-image-large',
  image_mobile: 'mock-image-mobile'
};

export const mockIngredientMain = {
  _id: '2',
  name: 'mock-main',
  type: 'main',
  proteins: 100,
  fat: 100,
  carbohydrates: 100,
  calories: 100,
  price: 100,
  image: 'mock-image',
  image_large: 'mock-image-large',
  image_mobile: 'mock-image-mobile'
};

export const mockIngredientOrder = ['mock-1', 'mock-2'];

export const mockOrder = {
  _id: '1',
  status: 'ready',
  name: 'mock-order',
  createdAt: 'monday',
  updatedAt: 'sunday',
  number: 1234,
  ingredients: mockIngredientOrder
};

export const mockOrderData = {
  orders: [mockOrder],
  total: 10,
  totalToday: 10
};

export const mockError = 'mock-error';
