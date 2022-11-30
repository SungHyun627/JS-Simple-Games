import {
  BOARD_ROW_LENGTH,
  GAME_STATE,
  INTERVAL_TIME,
  EVENT_TYPES,
  INITIAL_SNAKE_LENGTH,
} from '../constants/constants.js';
import {
  directionKeys,
  directions,
  isSameDirection,
  isReverseDirection,
  addPos,
} from '../utils/controlSnake.js';
import { createApple, comparePos } from '../utils/createApple.js';
import { Scheduler } from '../utils/scheduler.js';

const inititalState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
  removedAppleCell: null,
  removedSnakeCell: null,
  eventType: null,
  gameState: GAME_STATE.BEFORE_START,
};

export default class Board {
  constructor({ container, ...props }) {
    this.container = container;
    this.state = {
      ...inititalState,
      appleCell: { ...createApple(inititalState.snakeQueue) },
    };
    this.props = props;
    this.scheduler = new Scheduler(this.moveSnake.bind(this), INTERVAL_TIME);
    this.initBoard();
    this.initEventListener();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    // console.log(this.state.gameState);
    this.render();
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
      this.state.gameState === GAME_STATE.BEFORE_START &&
      directionKeys.includes(e.key) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.play();
      this.setState({
        gameState: GAME_STATE.PLAYING,
        direction: directions[e.key.replace('Arrow', '')],
        eventType: EVENT_TYPES.CHANGE_DIRECTION,
      });
    }

    if (
      this.state.gameState === GAME_STATE.PLAYING &&
      directionKeys.includes(e.key) &&
      !isSameDirection(e.key, this.state.direction) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.setState({
        direction: directions[e.key.replace('Arrow', '')],
        eventType: EVENT_TYPES.CHANGE_DIRECTION,
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

  getCellDomElement(cell) {
    return document.querySelector(`[data-row="${cell.x}"][data-col="${cell.y}"]`);
  }

  play() {
    this.scheduler.start();
  }

  gameOver() {
    this.scheduler.end();
  }

  moveSnake() {
    const { x: headCellPosX, y: headCellPosY } = this.state.snakeQueue[0];

    if (
      this.isOutOfRange(
        headCellPosX + addPos[this.state.direction][0],
        headCellPosY + addPos[this.state.direction][1]
      )
    ) {
      // console.log('Hit wall');
      this.setState({ gameState: GAME_STATE.GAME_OVER, eventType: EVENT_TYPES.HIT_WALL });
      this.gameOver();
    }

    if (
      this.isHitWithSnakeBody(
        headCellPosX + addPos[this.state.direction][0],
        headCellPosY + addPos[this.state.direction][1],
        this.state.snakeQueue.slice(0, -1)
      )
    ) {
      // console.log('Hit Snake Body');
      this.setState({ gameState: GAME_STATE.GAME_OVER, eventType: EVENT_TYPES.HIT_SNAKE_BODY });
      this.gameOver();
    }

    if (
      this.state.gameState === GAME_STATE.PLAYING &&
      !this.isOutOfRange(
        headCellPosX + addPos[this.state.direction][0],
        headCellPosY + addPos[this.state.direction][1]
      )
    ) {
      // console.log('Move ForWard');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.unshift(this.getAddedSnakeCell());
      const removedCell = curQueue.pop();
      this.setState({
        snakeQueue: curQueue.slice(),
        removedSnakeCell: removedCell,
        eventType: EVENT_TYPES.MOVE_FORWARD,
      });
    }

    if (this.isSnakeGetApple(this.state.snakeQueue[0].x, this.state.snakeQueue[0].y)) {
      console.log('Get Apple');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.push(this.state.removedSnakeCell);
      this.setState({
        snakeQueue: curQueue.slice(),
        appleCell: {
          ...createApple(this.state.snakeQueue),
        },
        removedAppleCell: { ...this.state.appleCell },
        eventType: EVENT_TYPES.GET_APPLE,
      });
      this.props.getRealTimeScore();
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

  isOutOfRange(posX, posY) {
    return posX < 0 || posX >= BOARD_ROW_LENGTH || posY < 0 || posY >= BOARD_ROW_LENGTH;
  }

  isHitWithSnakeBody(posX, posY, queue) {
    return queue.some((pos) => comparePos(pos, { x: posX, y: posY }));
  }

  getScore() {
    return this.state.snakeQueue.length - INITIAL_SNAKE_LENGTH;
  }

  render() {
    if (this.state.eventType === EVENT_TYPES.CHANGE_DIRECTION) return;
    if (this.state.eventType === EVENT_TYPES.MOVE_FORWARD) {
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

    if (this.state.eventType === EVENT_TYPES.GET_APPLE) {
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

    if (this.state.eventType === EVENT_TYPES.HIT_WALL) {
      const headCell = { ...this.state.snakeQueue[0] };
      const headCellElement = this.getCellDomElement(headCell);
      headCellElement.classList.remove(
        `snake__head-${this.getDirectionName(this.state.direction)}`
      );
      headCellElement.classList.add(
        `snake__head__collision-${this.getDirectionName(this.state.direction)}`
      );
    }

    if (this.state.eventType === EVENT_TYPES.HIT_SNAKE_BODY) {
      const headCell = { ...this.state.snakeQueue[0] };
      const headCellElement = this.getCellDomElement(headCell);
      headCellElement.classList.remove(
        `snake__head-${this.getDirectionName(this.state.direction)}`
      );
      headCellElement.classList.add(
        `snake__head__collision-${this.getDirectionName(this.state.direction)}`
      );
    }
  }
}
