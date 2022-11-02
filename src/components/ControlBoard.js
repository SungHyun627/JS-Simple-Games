export default class ControlBoard {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const controlBoardContainer = document.createElement('div');
    controlBoardContainer.classList.add('control-board__container');

    const startButton = document.createElement('button');
    startButton.classList.add('start-btn');
    startButton.innerHTML = 'START';

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-btn');
    resetButton.innerHTML = 'RESET';

    controlBoardContainer.appendChild(startButton);
    controlBoardContainer.appendChild(resetButton);

    container.appendChild(controlBoardContainer);
  }
}
