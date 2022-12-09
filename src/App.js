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
    const $gameTitleContainer = $createElement({
      elementType: 'div',
      className: 'title__container',
    });
    const $scoreBoardContainer = $createElement({
      elementType: 'div',
      className: 'scoreboard__container',
    });
    const $boardContainer = $createElement({ elementType: 'div', className: 'board__container' });
    const $controlBoardContainer = $createElement({
      elementType: 'div',
      className: 'control-board__container',
    });
    const $modal = $createElement({ elementType: 'div', className: 'modal__container-hidden' });

    new GameTitle({ $target: $gameTitleContainer });
    new ScoreBoard({ $target: $scoreBoardContainer });
    new Board({
      $target: $boardContainer,
      showModal: () => this.#showModal(),
      setScoreInScoreBoard: (realTimeScore) => this.#setScoreInScoreBoard(realTimeScore),
      setScoreInModal: (realTimeScore) => this.#setScoreInModal(realTimeScore),
    });
    new ControlBoard({
      $target: $controlBoardContainer,
      restartGame: () => this.#restartGame(),
      resetGame: () => this.#resetGame(),
    });
    new Modal({ $target: $modal, restartGame: () => this.#restartGame() });

    $appContainer.appendChild($gameTitleContainer);
    $appContainer.appendChild($scoreBoardContainer);
    $appContainer.appendChild($boardContainer);
    $appContainer.appendChild($controlBoardContainer);

    $appContainer.appendChild($modal);

    this.rootContainer.appendChild($appContainer);
  }

  #setScoreInScoreBoard(realTimeScore) {
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
    this.board.initGame();
    this.scoreBoard.init();
  }

  #showModal() {
    this.modal.showModal();
  }
}
