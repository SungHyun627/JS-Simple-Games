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
  removedAppleCell: null,
  removedSnakeCell: null,
  eventType: null,
};

export default class Board {
  constructor({ container, props }) {
    this.container = container;
    this.props = props;
    this.state = {
      ...inititalBoardState,
      appleCell: { ...createApple(inititalBoardState.snakeQueue) },
    };
    this.initBoard();
    this.initEventListener();
    this.play();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log(this.state);
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
            cell.classList.add('snake__head-Right');
            cell.classList.add('direction-left');
          }
        }
      });

      if (rowIdx === this.state.appleCell.x && colIdx === this.state.appleCell.y) {
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

  getCellDomElement(cell) {
    return document.querySelector(`[data-row="${cell.x}"][data-col="${cell.y}"]`);
  }

  moveSnake() {
    if (this.props.getGameState() === GAME_STATE.PLAYING) {
      console.log('Move');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.unshift(this.getAddedSnakeCell());
      const removedCell = curQueue.pop();
      this.setState({
        snakeQueue: curQueue.slice(),
        removedSnakeCell: removedCell,
        eventType: EVEMT_TYPES.MOVE_FORWARD,
      });
    }

    const { x: headCellPosX, y: headCellPosY } = this.state.snakeQueue[0];
    if (this.isSnakeGetApple(headCellPosX, headCellPosY)) {
      console.log('Get Apple');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.push(this.state.removedSnakeCell);
      this.setState({
        snakeQueue: curQueue.slice(),
        appleCell: {
          ...createApple(this.state.snakeQueue),
        },
        removedAppleCell: { ...this.state.appleCell },
        eventType: EVEMT_TYPES.GET_APPLE,
      });
    }
  }

  removeHeadClassName(cell) {
    Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head-${key}`));
  }

  getDirectionName(direction) {
    return Object.keys(directions).find((key) => directions[key] === direction);
  }

  isSnakeGetApple(posX, posY) {
    return posX === this.state.appleCell.x && posY === this.state.appleCell.y;
  }

  render() {
    if (this.state.eventType === EVEMT_TYPES.CHANGE_DIRECTION) return;
    if (this.state.eventType === EVEMT_TYPES.MOVE_FORWARD) {
      const headCell = { ...this.state.snakeQueue[0] };
      const preHeadCell = { ...this.state.snakeQueue[1] };
      const removedCell = { ...this.state.removedSnakeCell };
      // console.log(headCell, preHeadCell, removedCell);

      const headCellElement = this.getCellDomElement(headCell);
      const preHeadCellElement = this.getCellDomElement(preHeadCell);
      const removedCellElement = this.getCellDomElement(removedCell);
      // console.log(preHeadCell, headCell, removedCell);
      this.removeHeadClassName(preHeadCellElement);
      headCellElement.classList.add('snake__cell');
      headCellElement.classList.add(`snake__head-${this.getDirectionName(this.state.direction)}`);

      removedCellElement.classList.remove('snake__cell');
    }

    if (this.state.eventType === EVEMT_TYPES.GET_APPLE) {
      const removedAppleCell = { ...this.state.removedAppleCell };
      const removedAppleCellElement = this.getCellDomElement(removedAppleCell);
      removedAppleCellElement.classList.remove('apple__cell');
      removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);

      const addedToTailCell = this.state.snakeQueue[this.state.snakeQueue.length - 1];
      const addedToTailCellElement = this.getCellDomElement(addedToTailCell);
      addedToTailCellElement.classList.add('snake__cell');

      const appleCell = { ...this.state.appleCell };
      const appleCellElement = this.getCellDomElement(appleCell);
      appleCellElement.classList.add('apple__cell');
      const apple = document.createElement('img');
      apple.setAttribute('src', './src/assets/apple.svg');
      apple.classList.add('apple-icon');
      appleCellElement.appendChild(apple);

      removedAppleCellElement.classList.add('snake__cell');
    }
  }
}
