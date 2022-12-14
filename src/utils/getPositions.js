import { directionArr } from './snakeDirection.js';
import { BOARD_ROW_LENGTH } from '../constants/constants.js';

export const getCellPos = (cellIdx) => {
  return { rowIdx: parseInt(cellIdx / BOARD_ROW_LENGTH, 10), colIdx: cellIdx % BOARD_ROW_LENGTH };
};

export const getNextSnakeHeadPos = (headPosX, headPosY, direction) => {
  const nextHeadPosX = headPosX + directionArr[direction][0];
  const nextHeadPosY = headPosY + directionArr[direction][1];
  return {
    nextHeadPosX,
    nextHeadPosY,
  };
};
