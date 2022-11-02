export default class ControlBoard {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const controlBoardContainer = document.createElement('div');
    controlBoardContainer.classList.add('control-board__container');

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-btn');
    resetButton.innerHTML = 'GAME RESET';

    controlBoardContainer.appendChild(resetButton);

    container.appendChild(controlBoardContainer);
  }
}
