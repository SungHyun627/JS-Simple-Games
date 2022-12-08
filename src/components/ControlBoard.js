import { $controlBoardTemplate } from '../utils/templates.js';

export default class ControlBoard {
  constructor({ $target, ...props }) {
    this.target = $target;
    this.props = props;
    this.init();
  }

  init() {
    this.target.innerHTML = $controlBoardTemplate;
    this.initEvent();
  }

  initEvent() {
    this.target
      .querySelector('.restart__btn')
      .addEventListener('click', () => this.props.restartGame());
    this.target
      .querySelector('.reset__btn')
      .addEventListener('click', () => this.props.resetGame());
  }
}
