import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
import ControlBoard from './components/ControlBoard.js';
import Modal from './components/Modal.js';
import { $createElement } from './utils/createElements.js';

export default class App {
  constructor(container) {
    this.rootContainer = container;
    this.init();
  }

  init() {
    const $appContainer = $createElement({ elementType: 'div', className: 'app__container' });
    const gameTitleContainer = $createElement({
      elementType: 'div',
      className: 'title__container',
    });
    const scoreBoardContainer = $createElement({
      elementType: 'div',
      className: 'scoreboard__container',
    });
    const boardContainer = $createElement({ elementType: 'div', className: 'board__container' });
    const controlBoardContainer = $createElement({
      elementType: 'div',
      className: 'control-board__container',
    });
    const modalContainer = $createElement({
      elementType: 'div',
      className: 'modal__container-hidden',
    });

    this.$gameTitle = new GameTitle({ $target: gameTitleContainer });
    this.$scoreBoard = new ScoreBoard({ $target: scoreBoardContainer });
    this.$board = new Board({
      $target: boardContainer,
      showModal: () => this.#showModal(),
      setScoreInScoreBoard: (realtimeScore) => this.#setScoreInScoreBoard(realtimeScore),
      setScoreInModal: (realtimeScore) => this.#setScoreInModal(realtimeScore),
    });
    this.$controlBoard = new ControlBoard({
      $target: controlBoardContainer,
      restartGame: () => this.#restartGame(),
      resetGame: () => this.#resetGame(),
    });
    this.$modal = new Modal({
      $target: modalContainer,
      restartGame: () => this.#restartGame(),
    });

    $appContainer.appendChild(gameTitleContainer);
    $appContainer.appendChild(scoreBoardContainer);
    $appContainer.appendChild(boardContainer);
    $appContainer.appendChild(controlBoardContainer);

    $appContainer.appendChild(modalContainer);

    this.rootContainer.appendChild($appContainer);
  }

  #setScoreInScoreBoard(realtimeScore) {
    return this.$scoreBoard.setScore(realtimeScore);
  }

  #setScoreInModal(realtimeScore) {
    return this.$modal.setScore(realtimeScore);
  }

  #restartGame() {
    this.$board.initBoard();
    this.$scoreBoard.resetRealtimeScore();
  }

  #resetGame() {
    this.$board.initBoard();
    this.$scoreBoard.init();
  }

  #showModal() {
    this.$modal.showModal();
  }
}
