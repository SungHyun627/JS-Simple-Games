import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
import ControlBoard from './components/ControlBoard.js';
import Modal from './components/Modal.js';
import { GAME_STATE } from './constants/constants.js';

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
      setRealTimeScore: () => this.#setScoreBoardRealTimeScore(),
    });
    this.board = new Board({
      container: pageContainer,
      getRealTimeScore: () => this.#getRealTimeScore(),
      showModal: () => this.#showModal(),
      isGameOver: () => this.#isGameOver(),
    });
    this.controlBoard = new ControlBoard({
      container: pageContainer,
      restartGame: () => this.#restartGame(),
      resetGame: () => this.#resetGame(),
    });
    this.container.appendChild(pageContainer);
    this.modal = new Modal({ container: this.container });
  }

  #isGameOver() {
    return this.board.getGameState() === GAME_STATE.GAME_OVER;
  }

  #getRealTimeScore() {
    const realTimeScore = this.board.getScore();
    this.#setScoreBoardRealTimeScore(realTimeScore);
  }

  #setScoreBoardRealTimeScore(realTimeScore) {
    return this.scoreBoard.printScore(realTimeScore);
  }

  #setModalScore() {}

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
