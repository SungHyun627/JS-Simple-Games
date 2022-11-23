export const directions = { Right: 0, Down: 1, Left: 2, Up: 3 };
export const directionKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];

export const isSameDirection = (key, direction) => {
  return key === directionKeys[direction];
};
export const isReverseDirection = (key, direction) => {
  return key === directionKeys[(direction + 2) % 4];
};
