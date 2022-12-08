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
import { $createAppleIconElement, $createCellElement } from '../utils/createElements.js';
import { createApplePos, comparePos } from '../utils/createApplePos.js';
import { Scheduler } from '../utils/scheduler.js';
import {
  $addBoardClass,
  $addEvenOddClass,
  $addSnakeClass,
  $addSnakeHeadClass,
  $addAppleClass,
} from '../utils/mainpulateClassName.js';

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
  constructor({ $target, ...props }) {
    this.state = {
      ...inititalState,
      applePos: { ...createApplePos(inititalState.snakeQueue) },
    };
    this.props = props;
    this.target = $target;
    this.init();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  init() {
    this.initBoard();
    this.scheduler = new Scheduler(this.moveSnake.bind(this), INTERVAL_TIME);
    this.initEvent();
  }

  // initGame() {
  //   this.removeAllSnakeCellClassName();
  //   this.setState({
  //     ...inititalState,
  //     appleCell: { ...createApplePos(inititalState.snakeQueue) },
  //     eventType: EVENT_TYPES.RESTART_GAME,
  //     removedAppleCell: { ...this.state.appleCell },
  //     gameState: GAME_STATE.BEFORE_START,
  //   });
  //   this.scheduler.end();
  // }

  initBoard() {
    const boardArr = new Array(BOARD_ROW_LENGTH ** 2).fill('empty');

    boardArr.forEach((_, idx) => {
      const { rowIdx, colIdx } = { ...this.calculateCellIndex(idx) };

      const cell = $createCellElement(rowIdx, colIdx);
      $addBoardClass(cell);
      $addEvenOddClass(cell, rowIdx, colIdx);
      this.target.appendChild(cell);
    });

    this.state.snakeQueue.forEach((snakePos, snakeIdx) => {
      const snakeCell = this.getCellDomElement(this.target, snakePos);
      $addSnakeClass(snakeCell);
      if (this.isSnakeHead(snakeIdx)) $addSnakeHeadClass(snakeCell, 'Right');
    });

    const appleCell = this.getCellDomElement(this.target, this.state.applePos);
    const appeIcon = $createAppleIconElement();
    appleCell.appendChild(appeIcon);
    $addAppleClass(appleCell);
  }

  initEvent() {
    window.addEventListener('keyup', this.changeDirection.bind(this));
  }

  calculateCellIndex(idx) {
    return { rowIdx: parseInt(idx / BOARD_ROW_LENGTH, 10), colIdx: idx % BOARD_ROW_LENGTH };
  }

  isSnakeHead(snakeIdx) {
    return snakeIdx === 0;
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

  getCellDomElement(target, cell) {
    return target.querySelector(`[data-row="${cell.x}"][data-col="${cell.y}"]`);
  }

  play() {
    this.scheduler.start();
  }

  getGameState() {
    return this.state.gameState;
  }

  gameOver() {
    this.scheduler.end();
    const realTimeScore = this.getScore();
    this.props.setScoreInModal(realTimeScore);
    this.props.showModal();
  }

  isGameOver() {
    return this.state.gameState === GAME_STATE.gameOver;
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
      // console.log('Get Apple');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.push(this.state.removedSnakeCell);
      this.setState({
        snakeQueue: curQueue.slice(),
        appleCell: {
          ...createApplePos(this.state.snakeQueue),
        },
        removedAppleCell: { ...this.state.appleCell },
        eventType: EVENT_TYPES.GET_APPLE,
      });
      const realTimeScore = this.getScore();
      this.props.setScoreInScoreBoard(realTimeScore);
    }
  }

  removeHeadClassName(cell) {
    Object.keys(directions).forEach((key) => cell.classList.remove(`snake__head-${key}`));
    Object.keys(directions).forEach((key) =>
      cell.classList.remove(`snake__head__collision-${key}`)
    );
  }

  removeAllSnakeCellClassName() {
    this.state.snakeQueue.forEach((snakePos, idx) => {
      const snakeCellDomElement = this.getCellDomElement(document, snakePos);
      snakeCellDomElement.classList.remove('snake__cell');
      if (idx === 0) this.removeHeadClassName(snakeCellDomElement);
    });
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
    if (this.state.eventType === EVENT_TYPES.RESTART_GAME) {
      this.state.snakeQueue.forEach((snakePos, idx) => {
        const snakePosDomElement = this.getCellDomElement(document, snakePos);
        if (idx === 0)
          snakePosDomElement.classList.add(
            `snake__head-${this.getDirectionName(this.state.direction)}`
          );
        snakePosDomElement.classList.add('snake__cell');
      });

      const removedAppleCell = { ...this.state.removedAppleCell };
      const removedAppleCellElement = this.getCellDomElement(document, removedAppleCell);
      removedAppleCellElement.classList.remove('apple__cell');
      removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);

      const appleCell = { ...this.state.appleCell };
      const appleCellElement = this.getCellDomElement(document, appleCell);
      appleCellElement.classList.add('apple__cell');
      const apple = document.createElement('img');
      apple.setAttribute('src', './src/assets/apple.svg');
      apple.classList.add('apple__icon');
      appleCellElement.appendChild(apple);
    }
    if (this.state.eventType === EVENT_TYPES.MOVE_FORWARD) {
      const headCell = { ...this.state.snakeQueue[0] };
      const preHeadCell = { ...this.state.snakeQueue[1] };
      const removedCell = { ...this.state.removedSnakeCell };

      const headCellElement = this.getCellDomElement(document, headCell);
      const preHeadCellElement = this.getCellDomElement(document, preHeadCell);
      const removedCellElement = this.getCellDomElement(document, removedCell);
      this.removeHeadClassName(preHeadCellElement);
      headCellElement.classList.add('snake__cell');
      headCellElement.classList.add(`snake__head-${this.getDirectionName(this.state.direction)}`);

      removedCellElement.classList.remove('snake__cell');
    }

    if (this.state.eventType === EVENT_TYPES.GET_APPLE) {
      const removedAppleCell = { ...this.state.removedAppleCell };
      const removedAppleCellElement = this.getCellDomElement(document, removedAppleCell);
      removedAppleCellElement.classList.remove('apple__cell');
      removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);

      const addedToTailCell = this.state.snakeQueue[this.state.snakeQueue.length - 1];
      const addedToTailCellElement = this.getCellDomElement(document, addedToTailCell);
      addedToTailCellElement.classList.add('snake__cell');

      const appleCell = { ...this.state.appleCell };
      const appleCellElement = this.getCellDomElement(document, appleCell);
      appleCellElement.classList.add('apple__cell');
      const apple = document.createElement('img');
      apple.setAttribute('src', './src/assets/apple.svg');
      apple.classList.add('apple__icon');
      appleCellElement.appendChild(apple);

      removedAppleCellElement.classList.add('snake__cell');
    }

    if (this.state.eventType === EVENT_TYPES.HIT_WALL) {
      const headCell = { ...this.state.snakeQueue[0] };
      const headCellElement = this.getCellDomElement(document, headCell);
      headCellElement.classList.remove(
        `snake__head-${this.getDirectionName(this.state.direction)}`
      );
      headCellElement.classList.add(
        `snake__head__collision-${this.getDirectionName(this.state.direction)}`
      );
    }

    if (this.state.eventType === EVENT_TYPES.HIT_SNAKE_BODY) {
      const headCell = { ...this.state.snakeQueue[0] };
      const headCellElement = this.getCellDomElement(document, headCell);
      headCellElement.classList.remove(
        `snake__head-${this.getDirectionName(this.state.direction)}`
      );
      headCellElement.classList.add(
        `snake__head__collision-${this.getDirectionName(this.state.direction)}`
      );
    }
  }
}
