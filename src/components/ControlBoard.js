export default class ControlBoard {
  constructor({ container, ...props }) {
    this.container = container;
    this.props = props;
    this.render();
  }

  render() {
    const controlBoardContainer = document.createElement('div');
    controlBoardContainer.classList.add('control-board__container');

    const restartBtn = document.createElement('button');
    restartBtn.classList.add('restart__btn');
    restartBtn.innerHTML = 'Restart';
    restartBtn.addEventListener('click', () => this.props.restartGame());

    const resetBtn = document.createElement('button');
    resetBtn.classList.add('reset__btn');
    resetBtn.innerHTML = 'Reset';

    controlBoardContainer.appendChild(restartBtn);
    controlBoardContainer.appendChild(resetBtn);

    this.container.appendChild(controlBoardContainer);
  }
}
