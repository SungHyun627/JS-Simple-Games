import { directions } from './snakeDirection.js';
import { getCellElement } from './elementSelector.js';

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

export const $addSnakeHeadCollisionClass = (cell, direction) => {
  cell.classList.add(`snake__head__collision-${direction}`);
};

export const $addAppleClass = (cell) => {
  cell.classList.add('apple__cell');
};

export const $removeSnakeClass = (cell) => {
  cell.classList.remove('snake__cell');
};
export const $removeSnakeHeadClass = (cell) => {
  Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head-${key}`));
  Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head__collision-${key}`));
};

export const $removeAppleClass = (cell) => {
  cell.classList.remove('apple__cell');
};

export const $removeAllSnakeClass = (state) => {
  state.snakeQueue.forEach((snakePos, idx) => {
    const snakeCell = getCellElement(document, snakePos);
    $removeSnakeClass(snakeCell);
    if (idx === 0) this.removeHeadClassName(snakeCell);
  });
};
