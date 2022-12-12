import { printBestScore, printRealTimeScore } from '../utils/render.js';
import { $scoreBoardTemplate } from '../utils/templates.js';

export default class ScoreBoard {
  constructor({ $target }) {
    this.state = { realtimeScore: 0, bestScore: this.getBestScoreSession() };
    this.target = $target;
    this.init();
  }

  init() {
    this.target.innerHTML = $scoreBoardTemplate;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    printRealTimeScore(this.target, this.state);
    printBestScore(this.target, this.state);
  }

  resetRealtimeScore() {
    this.setState({ realtimeScore: 0 });
  }

  setScore(score) {
    if (this.isRealtimeScoreBiggerThanBestScore(score)) {
      this.setState({ realtimeScore: score, bestScore: score });
      this.setBestScoreSession(score);
    } else {
      this.setState({ realtimeScore: score });
    }
  }

  setBestScoreSession(bestScore) {
    sessionStorage.setItem('bestScore', bestScore);
  }

  getBestScoreSession() {
    const bestScore = sessionStorage.getItem('bestScore');
    if (bestScore === null) this.setBestScoreSession(0);
    return bestScore !== null ? bestScore : 0;
  }

  isRealtimeScoreBiggerThanBestScore(score) {
    return score > this.state.bestScore;
  }
}
