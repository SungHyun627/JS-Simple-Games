import { BOARD_ROW_LENGTH } from '../constants/constants.js';
import { comparePos } from './getPositions.js';

const getRandom = () => Math.floor(Math.random() * BOARD_ROW_LENGTH);

export const createApplePos = (snakeQueue) => {
  const applePos = { x: getRandom(), y: getRandom() };
  if (snakeQueue.some((snakePos) => comparePos(snakePos, applePos)))
    return createApplePos(snakeQueue);
  return applePos;
};
