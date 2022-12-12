export const copySnakeQueue = (snakeQueue) => {
  const newSnakeQueue = [];
  snakeQueue.forEach((snakePos) => newSnakeQueue.push({ ...snakePos }));
  return newSnakeQueue;
};
