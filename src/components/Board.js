import {
  BOARD_ROW_LENGTH,
  GAME_STATE,
  INTERVAL_TIME,
  EVENT_TYPES,
  INITIAL_SNAKE_LENGTH,
} from '../constants/constants.js';
import {
  directions,
  isSameDirection,
  isReverseDirection,
  isDirectionKeycode,
  directionArr,
  getDirectionName,
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
} from '../utils/mainpulateClass.js';

import {
  addSnakeCell,
  addSnakeHeadCell,
  removeSnakeHeadCell,
  removeSnakeCell,
  addSnakeCollisionHeadCell,
} from '../utils/render.js';

import { getCellDomElement } from '../utils/domSelector.js';

const inititalState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
  removedApplePos: null,
  removedSnakePos: null,
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

  setState(newState, eventType) {
    this.state = { ...this.state, ...newState };
    console.log(this.state);
    if (eventType === EVENT_TYPES.MOVE_FORWARD) {
      this.moveForWard();
    }
    if (eventType === EVENT_TYPES.COLLIDE_WITH_WALL) {
      this.collisionWithWall();
    }
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
      const snakeCell = getCellDomElement(this.target, snakePos);
      $addSnakeClass(snakeCell);
      if (this.isSnakeHead(snakeIdx)) $addSnakeHeadClass(snakeCell, 'Right');
    });

    const appleCell = getCellDomElement(this.target, this.state.applePos);
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

  isBeforeGameStart() {
    return this.state.gameState === GAME_STATE.BEFORE_START;
  }

  isPlayingGame() {
    return this.state.gameState === GAME_STATE.PLAYING;
  }

  changeDirection(e) {
    if (
      this.isBeforeGameStart() &&
      isDirectionKeycode(e.key) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.play();
      this.setState(
        {
          gameState: GAME_STATE.PLAYING,
          direction: directions[e.key.replace('Arrow', '')],
          eventType: EVENT_TYPES.CHANGE_DIRECTION,
        },
        false
      );
    }

    if (
      this.isPlayingGame() &&
      isDirectionKeycode(e.key) &&
      !isSameDirection(e.key, this.state.direction) &&
      !isReverseDirection(e.key, this.state.direction)
    ) {
      this.setState(
        {
          direction: directions[e.key.replace('Arrow', '')],
          eventType: EVENT_TYPES.CHANGE_DIRECTION,
        },
        false
      );
    }
  }

  getNextSnakeHeadPos() {
    const { x: headPosX, y: headPosY } = this.state.snakeQueue[0];
    const nextHeadPosX = headPosX + directionArr[this.state.direction][0];
    const nextHeadPosY = headPosY + directionArr[this.state.direction][1];
    return {
      nextHeadPosX,
      nextHeadPosY,
    };
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
    return this.state.gameState === GAME_STATE.GAME_OVER;
  }

  moveSnake() {
    const { nextHeadPosX, nextHeadPosY } = this.getNextSnakeHeadPos();
    if (this.isOutOfRange(nextHeadPosX, nextHeadPosY)) {
      // console.log('Collide with wall');
      this.setState({ gameState: GAME_STATE.GAME_OVER }, EVENT_TYPES.COLLIDE_WITH_WALL);
      this.gameOver();
    }

    if (
      this.isCollideWithSnakeBody(nextHeadPosX, nextHeadPosY, this.state.snakeQueue.slice(0, -1))
    ) {
      // console.log('Collide with Snake Body');
      this.setState(
        { gameState: GAME_STATE.GAME_OVER, eventType: EVENT_TYPES.COLLIDE_WITH_SNAKE_BODY },
        true
      );
      this.gameOver();
    }

    if (this.isPlayingGame() && !this.isOutOfRange(nextHeadPosX, nextHeadPosY)) {
      const curSnakeQueue = this.state.snakeQueue.slice();
      curSnakeQueue.unshift({ x: nextHeadPosX, y: nextHeadPosY });
      const nextRemovedSnakePos = curSnakeQueue.pop();
      this.setState(
        {
          snakeQueue: curSnakeQueue.slice(),
          removedSnakePos: nextRemovedSnakePos,
        },
        EVENT_TYPES.MOVE_FORWARD
      );
    }

    if (this.isSnakeGetApple(nextHeadPosX, nextHeadPosY)) {
      // console.log('Get Apple');
      const curQueue = this.state.snakeQueue.slice();
      curQueue.push(this.state.removedSnakePos);
      this.setState(
        {
          snakeQueue: curQueue.slice(),
          appleCell: {
            ...createApplePos(this.state.snakeQueue),
          },
          removedAppleCell: { ...this.state.appleCell },
          eventType: EVENT_TYPES.GET_APPLE,
        },
        true
      );
      const realTimeScore = this.getScore();
      this.props.setScoreInScoreBoard(realTimeScore);
    }
  }

  isSnakeGetApple(posX, posY) {
    return posX === this.state.applePos.x && posY === this.state.applePos.y;
  }

  isOutOfRange(posX, posY) {
    return posX < 0 || posX >= BOARD_ROW_LENGTH || posY < 0 || posY >= BOARD_ROW_LENGTH;
  }

  isCollideWithSnakeBody(posX, posY, queue) {
    return queue.some((pos) => comparePos(pos, { x: posX, y: posY }));
  }

  getScore() {
    return this.state.snakeQueue.length - INITIAL_SNAKE_LENGTH;
  }

  moveForWard() {
    addSnakeCell(this.target, this.state);
    addSnakeHeadCell(this.target, this.state);
    removeSnakeHeadCell(this.target, this.state);
    removeSnakeCell(this.target, this.state);
  }

  collisionWithWall() {
    removeSnakeHeadCell(this.target, this.state);
    addSnakeCollisionHeadCell(this.target, this.state);
  }

  render() {
    if (this.state.eventType === EVENT_TYPES.RESTART_GAME) {
      this.state.snakeQueue.forEach((snakePos, idx) => {
        const snakePosDomElement = getCellDomElement(document, snakePos);
        if (idx === 0)
          snakePosDomElement.classList.add(`snake__head-${getDirectionName(this.state.direction)}`);
        snakePosDomElement.classList.add('snake__cell');
      });

      const removedAppleCell = { ...this.state.removedAppleCell };
      const removedAppleCellElement = getCellDomElement(document, removedAppleCell);
      removedAppleCellElement.classList.remove('apple__cell');
      removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);

      const appleCell = { ...this.state.appleCell };
      const appleCellElement = getCellDomElement(document, appleCell);
      appleCellElement.classList.add('apple__cell');
      const apple = document.createElement('img');
      apple.setAttribute('src', './src/assets/apple.svg');
      apple.classList.add('apple__icon');
      appleCellElement.appendChild(apple);
    }

    if (this.state.eventType === EVENT_TYPES.GET_APPLE) {
      const removedAppleCell = { ...this.state.removedAppleCell };
      const removedAppleCellElement = getCellDomElement(document, removedAppleCell);
      removedAppleCellElement.classList.remove('apple__cell');
      removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);

      const addedToTailCell = this.state.snakeQueue[this.state.snakeQueue.length - 1];
      const addedToTailCellElement = getCellDomElement(document, addedToTailCell);
      addedToTailCellElement.classList.add('snake__cell');

      const appleCell = { ...this.state.appleCell };
      const appleCellElement = getCellDomElement(document, appleCell);
      appleCellElement.classList.add('apple__cell');
      const apple = document.createElement('img');
      apple.setAttribute('src', './src/assets/apple.svg');
      apple.classList.add('apple__icon');
      appleCellElement.appendChild(apple);

      removedAppleCellElement.classList.add('snake__cell');
    }

    if (this.state.eventType === EVENT_TYPES.COLLIDE_WITH_SNAKE_BODY) {
      const headCell = { ...this.state.snakeQueue[0] };
      const headCellElement = getCellDomElement(document, headCell);
      headCellElement.classList.remove(`snake__head-${getDirectionName(this.state.direction)}`);
      headCellElement.classList.add(
        `snake__head__collision-${getDirectionName(this.state.direction)}`
      );
    }
  }
}
