export const getCellElement = (target, cell) => {
  return target.querySelector(`[data-row="${cell.x}"][data-col="${cell.y}"]`);
};

export const getRealtimeScoreElement = (target) => {
  return target.querySelector('.realtime__score .scoreboard__score__text');
};

export const getBestScoreElement = (target) => {
  return target.querySelector('.best__score .scoreboard__score__text');
};

export const getRestartBtnElement = (target) => {
  return target.querySelector('.restart__btn');
};

export const getResetBtnElement = (target) => {
  return target.querySelector('.reset__btn');
};
