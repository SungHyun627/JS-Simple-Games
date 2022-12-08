export const $createElement = ({ elementType, className, attributes }) => {
  const element = document.createElement(elementType);
  if (className) element.classList.add(className);
  if (attributes)
    attributes.forEach((attribute) => {
      const id = attribute[0];
      const value = attribute[1];
      element.setAttribute(id, value);
    });
  return element;
};

export const $createCellElement = (row, col) => {
  const element = $createElement({
    elementType: 'div',
    className: 'board__cell',
    attributes: [
      ['data-row', row],
      ['data-col', col],
    ],
  });
  return element;
};

export const $createAppleIconElement = () => {
  const element = $createElement({
    elementType: 'img',
    className: 'apple__icon',
    attributes: [['src', './src/assets/apple.svg']],
  });
  return element;
};
