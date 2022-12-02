import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
import ControlBoard from './components/ControlBoard.js';
import Modal from './components/Modal.js';

export default class App {
  constructor(container) {
    this.container = container;
    this.init();
    this.render();
  }

  init() {
    this.gameTitleComponent = '';
    this.scoreBoard = '';
    this.board = '';
    this.controlBoard = '';
    this.modal = '';
  }

  render() {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    this.gameTtile = new GameTitle(pageContainer);
    this.scoreBoard = new ScoreBoard({
      container: pageContainer,
    });
    this.board = new Board({
      container: pageContainer,
      showModal: () => this.#showModal(),
      setScoreInScoreBoard: (realTimeScore) => this.#setScoreInScoreBoard(realTimeScore),
      setScoreInModal: (realTimeScore) => this.#setScoreInModal(realTimeScore),
    });
    this.controlBoard = new ControlBoard({
      container: pageContainer,
      restartGame: () => this.#restartGame(),
      resetGame: () => this.#resetGame(),
    });
    this.container.appendChild(pageContainer);
    this.modal = new Modal({ container: this.container });
  }

  #setScoreInScoreBoard(realTimeScore) {
    console.log(realTimeScore);
    return this.scoreBoard.setScore(realTimeScore);
  }

  #setScoreInModal(realTimeScore) {
    return this.modal.setScore(realTimeScore);
  }

  #restartGame() {
    this.board.init();
    this.scoreBoard.resetRealTimeScore();
  }

  #resetGame() {
    this.board.init();
    this.scoreBoard.init();
  }

  #showModal() {
    this.modal.showModal();
  }

  #closeModal() {
    this.modal.closeModal();
  }
}
