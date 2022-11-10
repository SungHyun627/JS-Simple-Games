import { BOARD_ROW_LENGTH } from '../constants/constants.js';

const getRandom = () => Math.floor(Math.random() * BOARD_ROW_LENGTH);
const getSnakePos = (snakeState) =>
  snakeState.map((state) => {
    return { x: state.x, y: state.y };
  });
const comparePos = (x, y) => JSON.stringify(x) === JSON.stringify(y);

export const createApple = (snakeState) => {
  const applePos = { x: getRandom(), y: getRandom() };
  if (getSnakePos(snakeState).some((snakePos) => comparePos(snakePos, applePos)))
    return createApple(snakeState);
  return applePos;
};
