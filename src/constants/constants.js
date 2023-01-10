export const BOARD_ROW_LENGTH = 20;
export const INTERVAL_TIME = 100;
export const INITIAL_SNAKE_LENGTH = 3;

export const GAME_STATE = {
  BEFORE_START: 'Before Start',
  PLAYING: 'Playing',
  GAME_OVER: 'GameOver',
};

export const SNAKE_STATE = {
  STAND_STILL: 'Stand Still',
  CHANGE_DIRECTION: 'Change Direction',
  MOVE_FORWARD: 'Move Forward',
  GET_APPLE: 'Get Apple',
  COLLIDE_WITH_WALL: 'Collide With Wall',
  COLLIDE_WITH_SNAKE_BODY: 'Collide With Snake Body',
  INIT_SNAKE_AND_APPLE: 'Init Snake and Apple',
};

export const INITIAL_BOARD_STATE = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
  removedApplePos: null,
  removedSnakePos: null,
  gameState: GAME_STATE.BEFORE_START,
  snakeState: SNAKE_STATE.STAND_STILL,
};

export const MODAL_STATE = {
  HIDDEN: 'Hidden',
  SHOW: 'Show',
};
