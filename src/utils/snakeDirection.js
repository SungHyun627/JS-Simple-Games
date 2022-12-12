export const directions = { Right: 0, Down: 1, Left: 2, Up: 3 };
export const directionKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
export const directionArr = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export const isSameDirection = (key, direction) => {
  return key === directionKeys[direction];
};
export const isReverseDirection = (key, direction) => {
  return key === directionKeys[(direction + 2) % 4];
};

export const isDirectionKeycode = (key) => {
  return directionKeys.includes(key);
};

export const getDirectionName = (direction) => {
  return Object.keys(directions).find((key) => directions[key] === direction);
};
