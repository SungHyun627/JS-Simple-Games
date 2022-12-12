import {
  $addSnakeClass,
  $addSnakeHeadClass,
  $removeSnakeHeadClass,
  $removeSnakeClass,
  $addSnakeHeadCollisionClass,
  $removeAppleClass,
  $addAppleClass,
} from './mainpulateClass.js';
import { $createAppleIconElement } from './createElements.js';
import { getDirectionName } from './snakeDirection.js';
import { getBestScoreElement, getCellElement, getRealtimeScoreElement } from './elementSelector.js';
import { GAME_STATE } from '../constants/constants.js';

export const addSnakeCell = (target, state) => {
  const snakePos = state.snakeQueue[0];
  const snakeCell = getCellElement(target, snakePos);
  $addSnakeClass(snakeCell);
};

export const addSnakeHeadCell = (target, state) => {
  const headPos = state.snakeQueue[0];
  const headCell = getCellElement(target, headPos);
  $addSnakeHeadClass(headCell, getDirectionName(state.direction));
};

export const addSnakeCollisionHeadCell = (target, state) => {
  const headPos = state.snakeQueue[0];
  const headCell = getCellElement(target, headPos);
  $addSnakeHeadCollisionClass(headCell, getDirectionName(state.direction));
};

export const addAppleCell = (target, state) => {
  const applePos = { ...state.applePos };
  const appleCell = getCellElement(target, applePos);
  const appleIconElment = $createAppleIconElement();
  appleCell.appendChild(appleIconElment);
  $addAppleClass(appleCell);
};

export const removeSnakeHeadCell = (target, state) => {
  const preHeadPos =
    state.gameState === GAME_STATE.GAME_OVER ? state.snakeQueue[0] : state.snakeQueue[1];
  const preHeadCell = getCellElement(target, preHeadPos);
  $removeSnakeHeadClass(preHeadCell);
};

export const removeSnakeCell = (target, state) => {
  const removedSnakePos = { ...state.removedSnakePos };
  const removedSnakeCell = getCellElement(target, removedSnakePos);
  $removeSnakeClass(removedSnakeCell);
};

export const removeAppleCell = (target, state) => {
  const removedApplePos = { ...state.removedApplePos };
  const removedAppleCell = getCellElement(target, removedApplePos);
  removedAppleCell.removeChild(removedAppleCell.firstChild);
  $removeAppleClass(removedAppleCell);
};

export const printRealTimeScore = (target, state) => {
  const realtimeScoreElement = getRealtimeScoreElement(target);
  realtimeScoreElement.innerHTML = state.realtimeScore;
};

export const printBestScore = (target, state) => {
  const bestScoreElement = getBestScoreElement(target);
  bestScoreElement.innerHTML = state.bestScore;
};
