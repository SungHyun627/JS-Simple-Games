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
