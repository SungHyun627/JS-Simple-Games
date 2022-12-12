import { getResetBtnElement, getRestartBtnElement } from '../utils/elementSelector.js';
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
    const restartBtnElement = getRestartBtnElement(this.target);
    const resetBtnElement = getResetBtnElement(this.target);
    restartBtnElement.addEventListener('click', () => this.props.restartGame());
    resetBtnElement.addEventListener('click', () => this.props.resetGame());
  }
}
