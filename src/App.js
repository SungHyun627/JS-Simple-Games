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
  }

  render() {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    this.gameTtile = new GameTitle(pageContainer);
    this.scoreBoard = new ScoreBoard({
      container: pageContainer,
      setRealTimeScore: () => this.#setScore,
    });
    this.board = new Board({
      container: pageContainer,
      getRealTimeScore: () => this.#getRealTimeScore(),
    });
    this.controlBoard = new ControlBoard(pageContainer);
    this.modal = new Modal(pageContainer);
    this.container.appendChild(pageContainer);
  }

  #getRealTimeScore() {
    return this.#setScore(this.board.getScore());
  }

  #setScore(realtimeScore) {
    return this.scoreBoard.printScore(realtimeScore);
  }
}
