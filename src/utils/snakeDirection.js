export const directions = { Right: 0, Down: 1, Left: 2, Up: 3 };
export const directionKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
export const directionArr = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export const getDirectionName = (direction) => {
  return Object.keys(directions).find((key) => directions[key] === direction);
};
