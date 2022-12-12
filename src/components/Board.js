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
  addAppleCell,
  removeAppleCell,
} from '../utils/render.js';
import { getCellDomElement } from '../utils/domSelector.js';
import { debounce } from '../utils/debounce.js';

const inititalState = {
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
      ...inititalState,
      applePos: { ...createApplePos(inititalState.snakeQueue) },
    };
    this.props = props;
    this.target = $target;
    this.init();
  }

  setState(newState, eventType) {
    this.state = { ...this.state, ...newState };
    if (
      JSON.stringify(this.state.snakeQueue[0]) ===
      JSON.stringify(this.state.snakeQueue[this.state.snakeQueue.length - 1])
    )
      console.log('Fire');
    if (eventType === EVENT_TYPE.MOVE_FORWARD)
      // console.log(this.state);
      this.moveForWard();
    if (
      eventType === EVENT_TYPE.COLLIDE_WITH_WALL ||
      eventType === EVENT_TYPE.COLLIDE_WITH_SNAKE_BODY
    )
      this.collision();

    if (eventType === EVENT_TYPE.GET_APPLE) this.getApple();
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
  //     eventType: EVENT_TYPE.RESTART_GAME,
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
    window.addEventListener(
      'keyup',
      debounce((e) => this.getDirection(e), INTERVAL_TIME)
    );
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

  changeDirection(e) {
    this.setState(
      {
        direction: directions[e.key.replace('Arrow', '')],
      },
      EVENT_TYPE.CHANGE_DIRECTION
    );
  }

  getDirection(e) {
    console.log(e.key);
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
      this.setState({ gameState: GAME_STATE.GAME_OVER }, EVENT_TYPE.COLLIDE_WITH_WALL);
      this.gameOver();
      return;
    }

    if (
      this.isCollideWithSnakeBody(nextHeadPosX, nextHeadPosY, this.state.snakeQueue.slice(0, -1))
    ) {
      console.log('Snake body');
      this.setState(
        {
          gameState: GAME_STATE.GAME_OVER,
        },
        EVENT_TYPE.COLLIDE_WITH_SNAKE_BODY
      );
      this.gameOver();
      return;
    }

    if (this.isSnakeGetApple(nextHeadPosX, nextHeadPosY)) {
      console.log('Get Apple');
      const nextSnakeQueue = this.state.snakeQueue;
      nextSnakeQueue.unshift({ x: nextHeadPosX, y: nextHeadPosY });
      this.setState(
        {
          snakeQueue: nextSnakeQueue,
          applePos: {
            ...createApplePos(nextSnakeQueue),
          },
          removedApplePos: { ...this.state.applePos },
        },
        EVENT_TYPE.GET_APPLE
      );
      return;
      // const realTimeScore = this.getScore();
      // this.props.setScoreInScoreBoard(realTimeScore);
    }

    const nextSnakeQueue = this.state.snakeQueue;
    nextSnakeQueue.unshift({ x: nextHeadPosX, y: nextHeadPosY });
    const nextRemovedSnakePos = nextSnakeQueue.pop();
    this.setState(
      {
        snakeQueue: nextSnakeQueue,
        removedSnakePos: nextRemovedSnakePos,
      },
      EVENT_TYPE.MOVE_FORWARD
    );
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
    removeSnakeHeadCell(this.target, this.state);
    removeSnakeCell(this.target, this.state);
    addSnakeCell(this.target, this.state);
    addSnakeHeadCell(this.target, this.state);
  }

  collision() {
    removeSnakeHeadCell(this.target, this.state);
    addSnakeCollisionHeadCell(this.target, this.state);
  }

  getApple() {
    removeAppleCell(this.target, this.state);
    addAppleCell(this.target, this.state);
    addSnakeCell(this.target, this.state);
    addSnakeHeadCell(this.target, this.state);
    removeSnakeHeadCell(this.target, this.state);
  }

  render() {
    // if (this.state.eventType === EVENT_TYPE.RESTART_GAME) {
    //   this.state.snakeQueue.forEach((snakePos, idx) => {
    //     const snakePosDomElement = getCellDomElement(document, snakePos);
    //     if (idx === 0)
    //       snakePosDomElement.classList.add(`snake__head-${getDirectionName(this.state.direction)}`);
    //     snakePosDomElement.classList.add('snake__cell');
    //   });
    //   const removedAppleCell = { ...this.state.removedApplePos };
    //   const removedAppleCellElement = getCellDomElement(document, removedAppleCell);
    //   removedAppleCellElement.classList.remove('apple__cell');
    //   removedAppleCellElement.removeChild(removedAppleCellElement.firstChild);
    //   const appleCell = { ...this.state.appleCell };
    //   const appleCellElement = getCellDomElement(document, appleCell);
    //   appleCellElement.classList.add('apple__cell');
    //   const apple = document.createElement('img');
    //   apple.setAttribute('src', './src/assets/apple.svg');
    //   apple.classList.add('apple__icon');
    //   appleCellElement.appendChild(apple);
    // }
  }
}
