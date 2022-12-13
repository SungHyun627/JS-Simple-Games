import {
  $addSnakeClass,
  $addSnakeHeadClass,
  $removeSnakeHeadClass,
  $removeSnakeClass,
  $addSnakeHeadCollisionClass,
  $removeAppleClass,
  $addAppleClass,
  $removeSnakeCollisionHeadClass,
  $removeModalHideenClass,
  $addModalHideenClass,
} from './mainpulateClass.js';
import { $createAppleIconElement } from './createElements.js';
import { getDirectionName } from './snakeDirection.js';
import {
  getBestScoreElement,
  getCellElement,
  getModalBestScoreElement,
  getModalRealtimeScoreElement,
  getRealtimeScoreElement,
} from './elementSelector.js';

export const addSnakeCell = (target, snakePos) => {
  const snakeCell = getCellElement(target, snakePos);
  $addSnakeClass(snakeCell);
};

export const addAllSnakeCell = (target, allSnakePos) => {
  allSnakePos.forEach((snakePos) => {
    const snakeCell = getCellElement(target, snakePos);
    $addSnakeClass(snakeCell);
  });
};

export const addSnakeHeadCell = (target, headPos, direction) => {
  const headCell = getCellElement(target, headPos);
  $addSnakeHeadClass(headCell, getDirectionName(direction));
};

export const addSnakeCollisionHeadCell = (target, headPos, direction) => {
  const headCell = getCellElement(target, headPos);
  $addSnakeHeadCollisionClass(headCell, getDirectionName(direction));
};

export const addAppleCell = (target, applePos) => {
  const appleCell = getCellElement(target, applePos);
  const appleIconElment = $createAppleIconElement();
  appleCell.appendChild(appleIconElment);
  $addAppleClass(appleCell);
};

export const removeSnakeCell = (target, removedSnakePos) => {
  const removedSnakeCell = getCellElement(target, removedSnakePos);
  $removeSnakeClass(removedSnakeCell);
};

export const removeAllSnakeCell = (target, allSnakePos) => {
  allSnakePos.forEach((snakePos) => {
    const snakeCell = getCellElement(target, snakePos);
    $removeSnakeClass(snakeCell);
  });
};

export const removeSnakeHeadCell = (target, preHeadPos) => {
  const preHeadCell = getCellElement(target, preHeadPos);
  $removeSnakeHeadClass(preHeadCell);
};

export const removeSnakeCollisionHeadCell = (target, collisionHeadPos) => {
  const collsiionHeadCell = getCellElement(target, collisionHeadPos);
  $removeSnakeCollisionHeadClass(collsiionHeadCell);
};

export const removeAppleCell = (target, removedApplePos) => {
  const removedAppleCell = getCellElement(target, removedApplePos);
  removedAppleCell.removeChild(removedAppleCell.firstChild);
  $removeAppleClass(removedAppleCell);
};

export const printRealTimeScore = (target, realtimeScore) => {
  const realtimeScoreElement = getRealtimeScoreElement(target);
  realtimeScoreElement.innerHTML = realtimeScore;
};

export const printBestScore = (target, bestScore) => {
  const bestScoreElement = getBestScoreElement(target);
  bestScoreElement.innerHTML = bestScore;
};

export const printModalRealTimeScore = (target, realtimeScore) => {
  const modalRealtimeScoreElement = getModalRealtimeScoreElement(target);
  modalRealtimeScoreElement.innerHTML = realtimeScore;
};

export const printModalBestScore = (target) => {
  const modalBestScoreElement = getModalBestScoreElement(target);
  modalBestScoreElement.innerHTML = sessionStorage.getItem('bestScore');
};

export const showModal = (modalContainer) => {
  $removeModalHideenClass(modalContainer);
};

export const hideModal = (modalContainer) => {
  $addModalHideenClass(modalContainer);
};
