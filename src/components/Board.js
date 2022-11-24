import {
  BOARD_ROW_LENGTH,
  GAME_STATE,
  INTERVAL_TIME,
  EVEMT_TYPES,
} from '../constants/constants.js';
import {
  directionKeys,
  directions,
  isSameDirection,
  isReverseDirection,
  addPos,
} from '../utils/controlSnake.js';
import { createApple } from '../utils/createApple.js';

const inititalBoardState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
  removedSnakecell: null,
  eventType: null,
};

export default class Board {
  constructor({ container, props }) {
    this.container = container;
    this.props = props;
    this.state = {
      ...inititalBoardState,
      applePos: { ...createApple(inititalBoardState.snakeQueue) },
    };
    this.initBoard();
    this.initEventListener();
    this.play();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    // console.log(this.state);
    this.render(this.container);
  }

  initBoard() {
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
    this.container.appendChild(boardContainer);
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
      this.setState({
        direction: directions[e.key.replace('Arrow', '')],
        eventType: EVEMT_TYPES.CHANGE_DIRECTION,
      });
    }

    if (
      this.props.getGameState() === GAME_STATE.PLAYING &&
      directionKeys.includes(e.key) &&
      !isSameDirection(e.key, this.state.direction) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.setState({
        direction: directions[e.key.replace('Arrow', '')],
        eventType: EVEMT_TYPES.CHANGE_DIRECTION,
      });
    }
  }

  getAddedSnakeCell() {
    const curHeadPos = this.state.snakeQueue[0];
    return {
      x: curHeadPos.x + addPos[this.state.direction][0],
      y: curHeadPos.y + addPos[this.state.direction][1],
    };
  }

  play() {
    setInterval(this.moveSnake.bind(this), INTERVAL_TIME);
  }

  getSnakeDomElement(snakePos) {
    return document.querySelector(`[data-row="${snakePos.x}"][data-col="${snakePos.y}"]`);
  }

  moveSnake() {
    if (this.props.getGameState() === GAME_STATE.PLAYING) {
      const curQueue = this.state.snakeQueue.slice();
      curQueue.unshift(this.getAddedSnakeCell());
      const removedCell = curQueue.pop();
      this.setState({
        snakeQueue: curQueue,
        removedSnakecell: removedCell,
        eventType: EVEMT_TYPES.MOVE_FORWARD,
      });
    }
  }

  render() {
    if (this.state.eventType === EVEMT_TYPES.CHANGE_DIRECTION) return;
    const headCellPos = this.state.snakeQueue[0];
    const preHeadCellPos = this.state.snakeQueue[1];
    const removedCellPos = this.state.removedSnakecell;
    // console.log(headCellPos, preHeadCellPos, removedCellPos);

    const headCell = this.getSnakeDomElement(headCellPos);
    const preHeadCell = this.getSnakeDomElement(preHeadCellPos);
    const removedCell = this.getSnakeDomElement(removedCellPos);
    // console.log(preHeadCell, headCell, removedCell);
    preHeadCell.classList.remove('snake__head');
    headCell.classList.add('snake__cell');
    headCell.classList.add('snake__head');

    removedCell.classList.remove('snake__cell');
  }
}
