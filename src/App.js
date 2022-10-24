import GameTitle from './components/GameTitle.js';

export default class App {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    new GameTitle(pageContainer);
    container.appendChild(pageContainer);
  }
}
