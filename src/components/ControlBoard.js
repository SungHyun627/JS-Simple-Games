export default class ControlBoard {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const controlBoardContainer = document.createElement('div');
    controlBoardContainer.classList.add('control-board__container');

    const reStartButton = document.createElement('button');
    reStartButton.classList.add('restart__btn');
    reStartButton.innerHTML = 'Restart';

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset__btn');
    resetButton.innerHTML = 'Reset';

    controlBoardContainer.appendChild(reStartButton);
    controlBoardContainer.appendChild(resetButton);

    container.appendChild(controlBoardContainer);
  }
}
