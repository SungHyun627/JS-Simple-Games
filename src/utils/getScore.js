import { INITIAL_SNAKE_LENGTH } from '../constants/constants.js';

export const getScore = (state) => {
  return state.snakeQueue.length - INITIAL_SNAKE_LENGTH;
};
