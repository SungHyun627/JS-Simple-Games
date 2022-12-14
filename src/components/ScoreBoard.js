import { printBestScore, printRealTimeScore } from '../utils/render.js';
import { setBestScoreInSession, getBestScoreFromSession } from '../utils/sessionStorage.js';
import { $scoreBoardTemplate } from '../templates/templates.js';

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
    printRealTimeScore(this.target, this.state.realtimeScore);
    printBestScore(this.target, this.state.bestScore);
  }

  resetRealtimeScore() {
    this.setState({ realtimeScore: 0 });
  }

  resetBestScore() {
    this.setBestScoreInSession(0);
    this.setState({ bestScore: getBestScoreFromSession() });
  }

  setScore(score) {
    if (this.isRealtimeScoreBiggerThanBestScore(score)) {
      this.setState({ realtimeScore: score, bestScore: score });
      setBestScoreInSession(score);
    } else {
      this.setState({ realtimeScore: score });
    }
  }

  isRealtimeScoreBiggerThanBestScore(score) {
    return score > this.state.bestScore;
  }
}
