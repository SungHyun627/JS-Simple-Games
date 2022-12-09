export const getCellDomElement = (target, cell) => {
  return target.querySelector(`[data-row="${cell.x}"][data-col="${cell.y}"]`);
};
