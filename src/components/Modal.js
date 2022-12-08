import { MODAL_STATE } from '../constants/constants.js';
import { $modalTemplate } from '../utils/templates.js';

export default class Modal {
  constructor({ $target, ...props }) {
    this.state = { modalState: MODAL_STATE.HIDDEN };
    this.target = $target;
    this.props = props;
    this.init();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  init() {
    this.target.innerHTML = $modalTemplate;
    this.initEvent();
  }

  initEvent() {
    window.addEventListener('keyup', this.closeModalWithEscapeKey.bind(this));
    this.target
      .querySelector('.modal__close__icon')
      .addEventListener('click', this.closeModal.bind(this));
    this.target
      .querySelector('.modal__restart__btn')
      .addEventListener('click', this.closeModalForRestartGame.bind(this));
    this.target
      .querySelector('.modal__stop__playing__btn')
      .addEventListener('click', this.closeModal.bind(this));
  }

  render() {
    if (this.state.modalState === MODAL_STATE.SHOW) {
      const modalConatinerDomElement = document.querySelector('.modal__container-hidden');
      modalConatinerDomElement.classList.remove('modal__container-hidden');
      modalConatinerDomElement.classList.add('modal__container-show');
    }
    if (this.state.modalState === MODAL_STATE.HIDDEN) {
      const modalConatinerDomElement = document.querySelector('.modal__container-show');
      modalConatinerDomElement.classList.remove('modal__container-show');
      modalConatinerDomElement.classList.add('modal__container-hidden');
    }
  }

  showModal() {
    this.setState({ modalState: MODAL_STATE.SHOW });
  }

  setScore(realtimeScore) {
    const modalRealTimeScoreTextElement = document.querySelector('.modal__realtime__score__text');
    const modalBestScoreTextElement = document.querySelector('.modal__best__score__text');
    modalRealTimeScoreTextElement.innerHTML = realtimeScore;
    modalBestScoreTextElement.innerHTML = sessionStorage.getItem('bestScore');
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
}
