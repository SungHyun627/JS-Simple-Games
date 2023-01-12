import { comparePos } from './getPositions.js';
import { BOARD_ROW_LENGTH, GAME_STATE } from '../constants/constants.js';
import { directionKeys } from './snakeDirection.js';

export const isSnakeGetApple = (posX, posY, applePos) => {
  return posX === applePos.x && posY === applePos.y;
};

export const isCollidingWithWall = (posX, posY) => {
  return posX < 0 || posX >= BOARD_ROW_LENGTH || posY < 0 || posY >= BOARD_ROW_LENGTH;
};

export const isCollidingWithSnakeBody = (posX, posY, queue) => {
  return queue.some((pos) => comparePos(pos, { x: posX, y: posY }));
};

export const isBeforeGameStart = (gameState) => {
  return gameState === GAME_STATE.BEFORE_START;
};

export const isPlayingGame = (gameState) => {
  return gameState === GAME_STATE.PLAYING;
};

export const isSameDirection = (key, direction) => {
  return key === directionKeys[direction];
};
export const isReverseDirection = (key, direction) => {
  return key === directionKeys[(direction + 2) % 4];
};

export const isDirectionKeycode = (key) => {
  return directionKeys.includes(key);
};

export const isSatisfyingGameStartCondition = (e, gameState, direction) => {
  return isBeforeGameStart(gameState) && !isReverseDirection(e.key, direction);
};

export const isSatisfyingChangeDirectionCondition = (e, gameState, direction) => {
  return (
    isPlayingGame(gameState) &&
    !isSameDirection(e.key, direction) &&
    !isReverseDirection(e.key, direction)
  );
};

export const isRealtimeScoreBiggerThanBestScore = (realtimeScore, bestScore) => {
  return realtimeScore > bestScore;
};
