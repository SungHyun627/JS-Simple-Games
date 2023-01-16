import { printBestScore, printRealTimeScore } from '../utils/render.js';
import { setBestScoreInSession, getBestScoreFromSession } from '../utils/sessionStorage.js';
import { $scoreBoardTemplate } from '../templates/templates.js';
import { isRealtimeScoreBiggerThanBestScore } from '../utils/validation.js';

export default class ScoreBoard {
  constructor({ $target }) {
    this.state = { realtimeScore: 0, bestScore: 0 };
    this.target = $target;
    this.init();
  }

  init() {
    this.target.innerHTML = $scoreBoardTemplate;
    this.setState({ realtimeScore: 0, bestScore: getBestScoreFromSession() });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    printRealTimeScore(this.target, this.state.realtimeScore);
    printBestScore(this.target, this.state.bestScore);
  }

  resetRealtimeScore() {
    this.setState({ realtimeScore: 0 });
  }

  resetBestScore() {
    setBestScoreInSession(0);
    this.setState({ bestScore: getBestScoreFromSession() });
  }

  setScore() {
    const newRealtimeScore = this.state.realtimeScore + 1;
    if (isRealtimeScoreBiggerThanBestScore(newRealtimeScore, this.state.bestScore)) {
      this.setState({ realtimeScore: newRealtimeScore, bestScore: newRealtimeScore });
      setBestScoreInSession(newRealtimeScore);
    } else {
      this.setState({ realtimeScore: newRealtimeScore });
    }
  }
}
