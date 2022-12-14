import { MODAL_STATE } from '../constants/constants.js';
import {
  getModalCloseBtnElement,
  getModalRestartBtnElement,
  getModalStopPlayingBtnElement,
} from '../utils/elementSelector.js';
import {
  printModalRealTimeScore,
  printModalBestScore,
  showModal,
  hideModal,
} from '../utils/render.js';
import { $modalTemplate } from '../templates/templates.js';

export default class Modal {
  constructor({ $target, ...props }) {
    this.state = { modalState: MODAL_STATE.HIDDEN };
    this.target = $target;
    this.props = props;
    this.init();
    this.initEvent();
  }

  init() {
    this.target.innerHTML = $modalTemplate;
    hideModal(this.target);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    const $modalState = this.state.modalState;
    const $target = this.target;
    if ($modalState === MODAL_STATE.HIDDEN) hideModal($target);
    if ($modalState === MODAL_STATE.SHOW) showModal($target);
  }

  initEvent() {
    window.addEventListener('keyup', this.closeModalWithEscapeKey.bind(this));
    const modalCloseBtn = getModalCloseBtnElement(this.target);
    const modalRestartBtn = getModalRestartBtnElement(this.target);
    const modalStopPlayingBtn = getModalStopPlayingBtnElement(this.target);

    modalCloseBtn.addEventListener('click', this.closeModal.bind(this));
    modalRestartBtn.addEventListener('click', this.closeModalForRestartGame.bind(this));
    modalStopPlayingBtn.addEventListener('click', this.closeModal.bind(this));
  }

  openModal() {
    this.setState({ modalState: MODAL_STATE.SHOW });
  }

  closeModal() {
    this.setState({ modalState: MODAL_STATE.HIDDEN });
  }

  closeModalWithEscapeKey(e) {
    if (this.state.modalState === MODAL_STATE.HIDDEN) return;
    if (e.key === 'Escape') this.closeModal();
  }

  closeModalForRestartGame() {
    this.closeModal();
    this.props.restartGame();
  }

  setScore(realtimeScore) {
    const $target = this.target;
    printModalRealTimeScore($target, realtimeScore);
    printModalBestScore($target);
  }
}
