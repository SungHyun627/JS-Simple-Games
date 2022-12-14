import { getResetBtnElement, getRestartBtnElement } from '../utils/elementSelector.js';
import { $controlBoardTemplate } from '../templates/templates.js';

export default class ControlBoard {
  constructor({ $target, ...props }) {
    this.target = $target;
    this.props = props;
    this.init();
    this.initEvent();
  }

  init() {
    this.target.innerHTML = $controlBoardTemplate;
  }

  initEvent() {
    const restartBtnElement = getRestartBtnElement(this.target);
    const resetBtnElement = getResetBtnElement(this.target);
    restartBtnElement.addEventListener('click', () => {
      this.props.restartGame();
      this.removeButtonFocus(restartBtnElement);
    });
    resetBtnElement.addEventListener('click', () => {
      this.props.resetGame();
      this.removeButtonFocus(resetBtnElement);
    });
  }

  removeButtonFocus(btn) {
    btn.blur();
  }
}
