import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
import ControlBoard from './components/ControlBoard.js';
import Modal from './components/Modal.js';

const inititalGameState = {
  snakeQueue: [
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
  ],
  direction: 0,
};
export default class App {
  constructor(container) {
    this.container = container;
    this.gameState = { ...inititalGameState };
    this.render(container);
  }

  render(container) {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    new GameTitle(pageContainer);
    new ScoreBoard(pageContainer, this.gameState);
    new Board(pageContainer, this.gameState);
    new ControlBoard(pageContainer, this.gameState);
    new Modal(pageContainer, this.gameState);
    container.appendChild(pageContainer);
  }
}
