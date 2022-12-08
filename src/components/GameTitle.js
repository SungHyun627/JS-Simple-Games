import { $gameTitleTemplate } from '../utils/templates.js';

export default class GameTitle {
  constructor({ $target }) {
    this.target = $target;
    this.init();
  }

  init() {
    this.target.innerHTML = $gameTitleTemplate;
  }
}
