import GameTitle from './components/GameTitle.js';
import ScoreBoard from './components/ScoreBoard.js';
import Board from './components/Board.js';
import ControlBoard from './components/ControlBoard.js';
import Modal from './components/Modal.js';
import { GAME_STATE } from './constants/constants.js';

const initialState = {
  gameState: GAME_STATE.BEFORE_START,
};

export default class App {
  constructor(container) {
    this.container = container;
    this.state = { ...initialState };
    this.render(container);
  }

  handleGameState(command) {
    if (this.state.gameState === GAME_STATE.BEFORE_START && command === GAME_STATE.PLAYING)
      this.setState({ gameState: GAME_STATE.PLAYING });
    if (this.state.gameState === GAME_STATE.PLAYING && command === GAME_STATE.GAME_OVER)
      this.setState({ gameState: GAME_STATE.GAME_OVER });
  }

  isValidStartDirection(e) {
    return e.key !== 'ArrowLeft';
  }

  isBeforeStartGame() {
    return this.state.gameState === GAME_STATE.BEFORE_START;
  }

  setStartDirection(e) {
    this.setState({ gameState: GAME_STATE.PLAYING, startMoveDirection: e.key });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log(this.state);
  }

  render(container) {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page__container');
    new GameTitle(pageContainer);
    new ScoreBoard(pageContainer);
    new Board({
      container: pageContainer,
      props: {
        getGameState: () => this.state.gameState,
        gameStateHandler: (command) => this.handleGameState(command),
      },
    });
    new ControlBoard(pageContainer);
    new Modal(pageContainer);
    container.appendChild(pageContainer);
  }
}
