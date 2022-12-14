import { $addBoardClass, $addEvenOddClass } from '../utils/mainpulateClass.js';
import { $createCellElement } from '../utils/createElements.js';
import { BOARD_ROW_LENGTH } from '../constants/constants.js';
import { getCellPos } from '../utils/getPositions.js';

export const $gameTitleTemplate = `
  <img class="snake__icon" src="src/assets/snake-icon-white.svg">
  <div class="title__text">Snake Game</div>
`;

export const $scoreBoardTemplate = `
<div class="realtime__score">
  <img class="score__icon" src="src/assets/apple.svg">
  <div class="scoreboard__score__text">0</div>
</div>
<div class="best__score">
  <img class="score__icon" src="src/assets/trophy.svg">
  <div class="scoreboard__score__text">0</div>
</div>
`;

export const $modalTemplate = `
  <div class="modal__background"></div>
  <div class="modal__wrapper">
    <button class="modal__close__btn">
      <img class="modal__close__icon" src="src/assets/close-icon.svg"/>
    </button>
    <img class="modal__snake__icon" src="src/assets/snake-icon-black.svg">
    <div class="modal__gameover__text">Game Over</div>
    <div class="modal__score__result">
      <div class="modal__realtime__score">
        <img class="score__icon" src="src/assets/apple.svg">
        <div class="modal__realtime__score__text">0</div>
      </div>
      <div class="modal__best__score">
        <img class="score__icon" src="src/assets/trophy.svg">
        <div class="modal__best__score__text">0</div></div>
      </div>
    <div class="modal__control__btns">
        <button class="modal__restart__btn">Restart Game</button>
        <button class="modal__stop__playing__btn">Stop Playing</button>
    </div>
  </div>
`;

export const $controlBoardTemplate = `
  <button class="restart__btn">Restart</button>
  <button class="reset__btn">Reset</button>
`;

export const $emptyBoardTemplate = (target) => {
  const boardArr = new Array(BOARD_ROW_LENGTH ** 2).fill('empty');

  boardArr.forEach((_, idx) => {
    const { rowIdx, colIdx } = { ...getCellPos(idx) };

    const cell = $createCellElement(rowIdx, colIdx);
    $addBoardClass(cell);
    $addEvenOddClass(cell, rowIdx, colIdx);
    target.appendChild(cell);
  });
};
