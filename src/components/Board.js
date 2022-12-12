import {
  BOARD_ROW_LENGTH,
  GAME_STATE,
  INTERVAL_TIME,
  EVENT_TYPE,
  INITIAL_SNAKE_LENGTH,
} from '../constants/constants.js';
import {
  directions,
  isSameDirection,
  isReverseDirection,
  directionArr,
} from '../utils/snakeDirection.js';
import { $createCellElement } from '../utils/createElements.js';
import { createApplePos, comparePos } from '../utils/createApplePos.js';
import { Scheduler } from '../utils/scheduler.js';
import { $addBoardClass, $addEvenOddClass } from '../utils/mainpulateClass.js';
import {
  addSnakeCell,
  addSnakeHeadCell,
  removeSnakeHeadCell,
  removeSnakeCell,
  addSnakeCollisionHeadCell,
  addAppleCell,
  removeAppleCell,
  removeAllSnakeCell,
  removeSnakeCollisionHeadCell,
  addAllSnakeCell,
} from '../utils/render.js';
import { debounce } from '../utils/debounce.js';
import { copySnakeQueue } from '../utils/copySnakeQueue.js';

const initialBoardState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
  removedApplePos: null,
  removedSnakePos: null,
  gameState: GAME_STATE.BEFORE_START,
};

export default class Board {
  constructor({ $target, ...props }) {
    this.state = {
      ...initialBoardState,
      applePos: { ...createApplePos(initialBoardState.snakeQueue) },
    };
    this.props = props;
    this.target = $target;
    this.scheduler = new Scheduler(this.moveSnake.bind(this), INTERVAL_TIME);
    this.initBoardTemplate();
    this.init();
    this.initEvent();
  }

  init() {
    const $allSnakePos = this.state.snakeQueue;
    const $applePos = this.state.applePos;
    const $snakeHeadPos = this.state.snakeQueue[0];
    const $direction = this.state.direction;
    addAllSnakeCell(this.target, $allSnakePos);
    addSnakeHeadCell(this.target, $snakeHeadPos, $direction);
    addAppleCell(this.target, $applePos);
  }

  setState(newState, eventType) {
    this.state = { ...this.state, ...newState };
    if (eventType === EVENT_TYPE.MOVE_FORWARD) this.moveForWard();
    if (
      eventType === EVENT_TYPE.COLLIDE_WITH_WALL ||
      eventType === EVENT_TYPE.COLLIDE_WITH_SNAKE_BODY
    )
      this.collision();
    if (eventType === EVENT_TYPE.GET_APPLE) this.getApple();
    if (eventType === EVENT_TYPE.INIT) this.init();
  }

  initBoardTemplate() {
    const boardArr = new Array(BOARD_ROW_LENGTH ** 2).fill('empty');

    boardArr.forEach((_, idx) => {
      const { rowIdx, colIdx } = { ...this.calculateCellIndex(idx) };

      const cell = $createCellElement(rowIdx, colIdx);
      $addBoardClass(cell);
      $addEvenOddClass(cell, rowIdx, colIdx);
      this.target.appendChild(cell);
    });
  }

  initEvent() {
    window.addEventListener(
      'keyup',
      debounce((e) => this.getDirection(e), INTERVAL_TIME)
    );
  }

  initBoard() {
    const $target = this.target;
    const $allSnakePos = this.state.snakeQueue;
    const $snakeHeadPos = this.state.snakeQueue[0];
    const $applePos = this.state.applePos;

    removeAllSnakeCell($target, $allSnakePos);
    removeSnakeHeadCell($target, $snakeHeadPos);
    removeSnakeCollisionHeadCell($target, $snakeHeadPos);
    removeAppleCell($target, $applePos);

    this.scheduler.end();
    this.setState(
      {
        ...initialBoardState,
        appleCell: { ...createApplePos(initialBoardState.snakeQueue) },
        gameState: GAME_STATE.BEFORE_START,
      },
      EVENT_TYPE.INIT
    );
  }

  changeDirection(e) {
    this.setState(
      {
        direction: directions[e.key.replace('Arrow', '')],
      },
      EVENT_TYPE.CHANGE_DIRECTION
    );
  }

  getDirection(e) {
    if (this.isBeforeGameStart() && !isReverseDirection(e.key, this.state.direction)) {
      this.startGame(e);
      return;
    }

    if (
      this.isPlayingGame() &&
      !isSameDirection(e.key, this.state.direction) &&
      !isReverseDirection(e.key, this.state.direction)
    )
      this.changeDirection(e);
  }

  moveSnake() {
    const { nextHeadPosX, nextHeadPosY } = this.getNextSnakeHeadPos();
    if (this.isCollideWithWall(nextHeadPosX, nextHeadPosY)) {
      this.setState({ gameState: GAME_STATE.GAME_OVER }, EVENT_TYPE.COLLIDE_WITH_WALL);
      this.gameOver();
      return;
    }

    if (
      this.isCollideWithSnakeBody(nextHeadPosX, nextHeadPosY, this.state.snakeQueue.slice(0, -1))
    ) {
      this.setState(
        {
          gameState: GAME_STATE.GAME_OVER,
        },
        EVENT_TYPE.COLLIDE_WITH_SNAKE_BODY
      );
      this.gameOver();
      return;
    }

    const nextSnakeQueue = copySnakeQueue(this.state.snakeQueue);
    nextSnakeQueue.unshift({ x: nextHeadPosX, y: nextHeadPosY });

    if (this.isSnakeGetApple(nextHeadPosX, nextHeadPosY)) {
      this.setState(
        {
          snakeQueue: copySnakeQueue(nextSnakeQueue),
          applePos: {
            ...createApplePos(nextSnakeQueue),
          },
          removedApplePos: { ...this.state.applePos },
        },
        EVENT_TYPE.GET_APPLE
      );
      const realTimeScore = this.getScore();
      this.props.setScoreInScoreBoard(realTimeScore);
      return;
    }
    const nextRemovedSnakePos = nextSnakeQueue.pop();
    this.setState(
      {
        snakeQueue: copySnakeQueue(nextSnakeQueue),
        removedSnakePos: nextRemovedSnakePos,
      },
      EVENT_TYPE.MOVE_FORWARD
    );
  }

  moveForWard() {
    const $removedSnakeHeadPos = this.state.snakeQueue[1];
    const $direction = this.state.direction;
    const $removedSnakePos = this.state.removedSnakePos;
    const $addedSnakePos = this.state.snakeQueue[0];
    removeSnakeHeadCell(this.target, $removedSnakeHeadPos);
    removeSnakeCell(this.target, $removedSnakePos);
    addSnakeCell(this.target, $addedSnakePos);
    addSnakeHeadCell(this.target, $addedSnakePos, $direction);
  }

  collision() {
    const $snakeHeadPos = this.state.snakeQueue[0];
    const $direction = this.state.direction;
    removeSnakeHeadCell(this.target, $snakeHeadPos, $direction);
    addSnakeCollisionHeadCell(this.target, $snakeHeadPos, $direction);
  }

  getApple() {
    const $removedApplePos = this.state.removedApplePos;
    const $applePos = this.state.applePos;
    const $addedSnakePos = this.state.snakeQueue[0];
    const $direction = this.state.direction;
    const $removedSnakeHeadPos = this.state.snakeQueue[1];

    removeAppleCell(this.target, $removedApplePos);
    addAppleCell(this.target, $applePos);
    addSnakeCell(this.target, $addedSnakePos);
    addSnakeHeadCell(this.target, $addedSnakePos, $direction);
    removeSnakeHeadCell(this.target, $removedSnakeHeadPos);
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

  startGame(e) {
    this.setState(
      {
        gameState: GAME_STATE.PLAYING,
        direction: directions[e.key.replace('Arrow', '')],
      },
      EVENT_TYPE.CHANGE_DIRECTION
    );
    this.play();
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

  gameOver() {
    this.scheduler.end();
    const realTimeScore = this.getScore();
    this.props.setScoreInModal(realTimeScore);
    this.props.showModal();
  }

  isSnakeGetApple(posX, posY) {
    return posX === this.state.applePos.x && posY === this.state.applePos.y;
  }

  isCollideWithWall(posX, posY) {
    return posX < 0 || posX >= BOARD_ROW_LENGTH || posY < 0 || posY >= BOARD_ROW_LENGTH;
  }

  isCollideWithSnakeBody(posX, posY, queue) {
    return queue.some((pos) => comparePos(pos, { x: posX, y: posY }));
  }

  getScore() {
    return this.state.snakeQueue.length - INITIAL_SNAKE_LENGTH;
  }
}
