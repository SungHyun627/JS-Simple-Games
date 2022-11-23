import { BOARD_ROW_LENGTH, GAME_STATE } from '../constants/constants.js';
import {
  directionKeys,
  directions,
  isSameDirection,
  isReverseDirection,
} from '../utils/controlSnake.js';
import { createApple } from '../utils/createApple.js';

const inititalBoardState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
};

export default class Board {
  constructor({ container, props }) {
    this.container = container;
    this.props = props;
    this.state = {
      ...inititalBoardState,
      applePos: { ...createApple(inititalBoardState.snakeQueue) },
    };
    this.initBoard(container);
    this.initEventListener();
    this.moveSnake();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log(this.state);
    this.render(this.container);
  }

  initBoard(container) {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board__container');
    const board = new Array(BOARD_ROW_LENGTH ** 2).fill('empty');

    board.forEach((_, idx) => {
      const cell = document.createElement('div');
      cell.classList.add('board__cell');

      const rowIdx = parseInt(idx / BOARD_ROW_LENGTH, 10);
      const colIdx = idx % BOARD_ROW_LENGTH;

      cell.setAttribute('data-row', rowIdx);
      cell.setAttribute('data-col', colIdx);

      if ((rowIdx + colIdx) % 2 === 0) {
        cell.classList.add('cell-even');
      } else {
        cell.classList.add('cell-odd');
      }

      this.state.snakeQueue.forEach((snakePos, snakeIdx) => {
        const { x, y } = snakePos;
        if (x === rowIdx && y === colIdx) {
          cell.classList.add('snake__cell');
          if (snakeIdx === 0) {
            cell.classList.add('snake__head');
          }
        }
      });

      if (rowIdx === this.state.applePos.x && colIdx === this.state.applePos.y) {
        cell.classList.add('apple__cell');
        const apple = document.createElement('img');
        apple.setAttribute('src', './src/assets/apple.svg');
        apple.classList.add('apple-icon');
        cell.appendChild(apple);
      }
      boardContainer.appendChild(cell);
    });
    container.appendChild(boardContainer);
  }

  initEventListener() {
    window.addEventListener('keyup', this.changeDirection.bind(this));
  }

  changeDirection(e) {
    if (
      this.props.getGameState() === GAME_STATE.BEFORE_START &&
      directionKeys.includes(e.key) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.props.gameStateHandler(GAME_STATE.PLAYING);
      this.setState({ direction: directions[e.key.replace('Arrow', '')] });
    }

    if (
      this.props.gameState === GAME_STATE.PLAYING &&
      directionKeys.includes(e.key) &&
      !isSameDirection(e.key, this.state.direction) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.setState({ direction: directions[e.key.replace('Arrow', '')] });
    }
  }

  moveSnake() {}

  render() {
    this.state.snakeQueue.forEach((snakePos, snakeIdx) => {
      const { x: snakePosX, y: snakePosY } = snakePos;
      const snakeCell = document.querySelector(
        `[data-row="${snakePosX}"][data-col="${snakePosY}"]`
      );
      snakeCell.classList.add('snake__cell');
      if (snakeIdx === 0) {
        snakeCell.classList.add('snake__head');
      }
    });

    const { x: applePosX, y: applePosY } = this.state.applePos;
    const appleCell = document.querySelector(
      `.board__cell[data-row="${applePosX}"][data-col="${applePosY}"]`
    );
    appleCell.classList.add('apple__cell');
    const appleIcon = document.createElement('img');
    appleIcon.setAttribute('src', './src/assets/apple.svg');
    appleIcon.classList.add('apple-icon');
    appleCell.appendChild(appleIcon);
  }
}
