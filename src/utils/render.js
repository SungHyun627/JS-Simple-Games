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
import { getCellDomElement } from './domSelector.js';
import { GAME_STATE } from '../constants/constants.js';

export const addSnakeCell = (target, state) => {
  const snakePos = state.snakeQueue[0];
  const snakeCell = getCellDomElement(target, snakePos);
  $addSnakeClass(snakeCell);
};

export const addSnakeHeadCell = (target, state) => {
  const headPos = state.snakeQueue[0];
  const headCell = getCellDomElement(target, headPos);
  $addSnakeHeadClass(headCell, getDirectionName(state.direction));
};

export const addSnakeCollisionHeadCell = (target, state) => {
  const headPos = state.snakeQueue[0];
  const headCell = getCellDomElement(target, headPos);
  $addSnakeHeadCollisionClass(headCell, getDirectionName(state.direction));
};

export const addAppleCell = (target, state) => {
  const applePos = { ...state.applePos };
  const appleCell = getCellDomElement(target, applePos);
  const appleIconElment = $createAppleIconElement();
  appleCell.appendChild(appleIconElment);
  $addAppleClass(appleCell);
};

export const removeSnakeHeadCell = (target, state) => {
  const preHeadPos =
    state.gameState === GAME_STATE.GAME_OVER ? state.snakeQueue[0] : state.snakeQueue[1];
  const preHeadCell = getCellDomElement(target, preHeadPos);
  $removeSnakeHeadClass(preHeadCell);
};

export const removeSnakeCell = (target, state) => {
  const removedSnakePos = { ...state.removedSnakePos };
  const removedSnakeCell = getCellDomElement(target, removedSnakePos);
  $removeSnakeClass(removedSnakeCell);
};

export const removeAppleCell = (target, state) => {
  const removedApplePos = { ...state.removedApplePos };
  const removedAppleCell = getCellDomElement(target, removedApplePos);
  removedAppleCell.removeChild(removedAppleCell.firstChild);
  $removeAppleClass(removedAppleCell);
};
