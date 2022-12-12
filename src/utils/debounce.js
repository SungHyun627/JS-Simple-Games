import { isDirectionKeycode } from './snakeDirection.js';

export const debounce = (callback, delay) => {
  let timerId;
  return (e) => {
    if (timerId && isDirectionKeycode(e.key)) clearTimeout(timerId);
    if (isDirectionKeycode(e.key)) timerId = setTimeout(callback, delay, e);
  };
};
