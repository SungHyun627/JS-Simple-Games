export default class GameTitle {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title__container');

    const snakeIcon = document.createElement('div');
    snakeIcon.classList.add('snake__icon');

    const titleText = document.createElement('div');
    titleText.classList.add('title__text');
    titleText.innerHTML = 'Snake Game';
    titleContainer.appendChild(snakeIcon);
    titleContainer.appendChild(titleText);
    container.appendChild(titleContainer);
  }
}
