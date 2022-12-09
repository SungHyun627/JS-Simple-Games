import { directions } from './controlSnake.js';
import { getCellDomElement } from './domSelector.js';

export const $addBoardClass = (cell) => {
  cell.classList.add('board__cell');
};

export const $addSnakeClass = (cell) => {
  cell.classList.add('snake__cell');
};

export const $addEvenOddClass = (cell, row, col) => {
  if ((row + col) % 2 === 0) {
    cell.classList.add('cell-even');
  } else {
    cell.classList.add('cell-odd');
  }
};

export const $addSnakeHeadClass = (cell, direction) => {
  cell.classList.add(`snake__head-${direction}`);
};

export const $addAppleClass = (cell) => {
  cell.classList.add('apple__cell');
};

export const $removeHeadClass = (cell) => {
  Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head-${key}`));
  Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head__collision-${key}`));
};

export const $removeSnakeClass = (cell) => {
  cell.classList.remove('snake__cell');
};

export const $removeAllSnakeClass = (state) => {
  state.snakeQueue.forEach((snakePos, idx) => {
    const snakeCell = getCellDomElement(document, snakePos);
    $removeSnakeClass(snakeCell);
    if (idx === 0) this.removeHeadClassName(snakeCell);
  });
};
