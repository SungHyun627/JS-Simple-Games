import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
export default class App {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    new GameTitle(pageContainer);
    new ScoreBoard(pageContainer);
    new Board(pageContainer);
    container.appendChild(pageContainer);
  }
}
