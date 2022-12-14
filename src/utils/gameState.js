import { GAME_STATE } from '../constants/constants.js';

export const isBeforeGameStart = (gameState) => {
  return gameState === GAME_STATE.BEFORE_START;
};

export const isPlayingGame = (gameState) => {
  return gameState === GAME_STATE.PLAYING;
};
