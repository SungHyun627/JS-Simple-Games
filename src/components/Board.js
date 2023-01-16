import {
  GAME_STATE,
  INTERVAL_TIME,
  SNAKE_STATE,
  INITIAL_BOARD_STATE,
} from '../constants/constants.js';
import { directions } from '../utils/snakeDirection.js';
import { createApplePos } from '../utils/createApplePosition.js';
import { Scheduler } from '../utils/scheduler.js';
import {
  moveForWardRender,
  collisionRender,
  getAppleRender,
  removePreSnakeAndAppleCells,
  initSnakeAndAppleRender,
} from '../utils/render.js';
import { debounce } from '../utils/debounce.js';
import { copySnakeQueue } from '../utils/copySnakeQueue.js';
import { getNextSnakeHeadPos } from '../utils/getPositions.js';
import { $emptyBoardTemplate } from '../templates/templates.js';
import { getScore } from '../utils/getScore.js';
import {
  isSnakeGetApple,
  isCollidingWithWall,
  isCollidingWithSnakeBody,
  isSatisfyingChangeDirectionCondition,
  isSatisfyingGameStartCondition,
} from '../utils/validation.js';

export default class Board {
  constructor({ $target, ...props }) {
    this.state = {
      ...INITIAL_BOARD_STATE,
      applePos: { ...createApplePos(INITIAL_BOARD_STATE.snakeQueue) },
    };
    this.props = props;
    this.target = $target;
    this.scheduler = new Scheduler(this.moveSnake.bind(this), INTERVAL_TIME);
    this.initEmptyBoardTemplate(this.target);
    initSnakeAndAppleRender(this.target, this.state);
    this.initEvent();
  }

  initEmptyBoardTemplate(target) {
    $emptyBoardTemplate(target);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    switch (this.state.snakeState) {
      case SNAKE_STATE.MOVE_FORWARD:
        moveForWardRender(this.target, this.state);
        break;
      case SNAKE_STATE.COLLIDE_WITH_WALL:
        collisionRender(this.target, this.state);
        break;
      case SNAKE_STATE.COLLIDE_WITH_SNAKE_BODY:
        collisionRender(this.target, this.state);
        break;
      case SNAKE_STATE.GET_APPLE:
        getAppleRender(this.target, this.state);
        break;
      case SNAKE_STATE.STAND_STILL:
        initSnakeAndAppleRender(this.target, this.state);
        break;
      default:
        break;
    }
  }

  initEvent() {
    window.addEventListener(
      'keyup',
      debounce((e) => this.getDirection(e), INTERVAL_TIME)
    );
  }

  clearBoard() {
    removePreSnakeAndAppleCells(this.target, this.state);
  }

  initBoardState() {
    this.endTimer();
    this.setState({
      ...INITIAL_BOARD_STATE,
      applePos: { ...createApplePos(INITIAL_BOARD_STATE.snakeQueue) },
      gameState: GAME_STATE.BEFORE_START,
      snakeState: SNAKE_STATE.STAND_STILL,
    });
  }

  changeDirection(e) {
    this.setState({
      direction: directions[e.key.replace('Arrow', '')],
      snakeState: SNAKE_STATE.CHANGE_DIRECTION,
    });
  }

  getDirection(e) {
    if (isSatisfyingGameStartCondition(e, this.state.gameState, this.state.direction)) {
      this.startGame(e);
      return;
    }

    if (isSatisfyingChangeDirectionCondition(e, this.state.gameState, this.state.direction))
      this.changeDirection(e);
  }

  moveSnake() {
    const { nextHeadPosX, nextHeadPosY } = getNextSnakeHeadPos(
      this.state.snakeQueue[0].x,
      this.state.snakeQueue[0].y,
      this.state.direction
    );

    const nextSnakeQueue = copySnakeQueue(this.state.snakeQueue);
    nextSnakeQueue.unshift({ x: nextHeadPosX, y: nextHeadPosY });

    if (isCollidingWithWall(nextHeadPosX, nextHeadPosY)) {
      this.collideWithWall();
      return;
    }

    if (isCollidingWithSnakeBody(nextHeadPosX, nextHeadPosY, nextSnakeQueue.slice(1, -1))) {
      this.collideWithSnakeBody();
      return;
    }

    if (isSnakeGetApple(nextHeadPosX, nextHeadPosY, this.state.applePos)) {
      this.getApple(nextSnakeQueue);
      return;
    }
    this.moveForWard(nextSnakeQueue);
  }

  collideWithWall() {
    this.setState({ gameState: GAME_STATE.GAME_OVER, snakeState: SNAKE_STATE.COLLIDE_WITH_WALL });
    this.gameOver();
  }

  collideWithSnakeBody() {
    this.setState({
      gameState: GAME_STATE.GAME_OVER,
      snakeState: SNAKE_STATE.COLLIDE_WITH_SNAKE_BODY,
    });
    this.gameOver();
  }

  getApple(nextSnakeQueue) {
    this.setState({
      snakeQueue: copySnakeQueue(nextSnakeQueue),
      applePos: {
        ...createApplePos(nextSnakeQueue),
      },
      removedApplePos: { ...this.state.applePos },
      snakeState: SNAKE_STATE.GET_APPLE,
    });
    this.props.setScoreInScoreBoard();
  }

  moveForWard(nextSnakeQueue) {
    const nextRemovedSnakePos = nextSnakeQueue.pop();
    this.setState({
      snakeQueue: copySnakeQueue(nextSnakeQueue),
      removedSnakePos: nextRemovedSnakePos,
      snakeState: SNAKE_STATE.MOVE_FORWARD,
    });
  }

  startGame(e) {
    this.setState({
      gameState: GAME_STATE.PLAYING,
      direction: directions[e.key.replace('Arrow', '')],
      snakeState: SNAKE_STATE.CHANGE_DIRECTION,
    });
    this.startTimer();
  }

  gameOver() {
    this.endTimer();
    const realTimeScore = getScore(this.state);
    this.props.setScoreInModal(realTimeScore);
    this.props.showModal();
  }

  startTimer() {
    this.scheduler.start();
  }

  endTimer() {
    this.scheduler.end();
  }
}
