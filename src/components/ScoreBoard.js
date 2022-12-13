import { printBestScore, printRealTimeScore } from '../utils/render.js';
import { $scoreBoardTemplate } from '../utils/templates.js';

export default class ScoreBoard {
  constructor({ $target }) {
    this.state = { realtimeScore: 0, bestScore: 0 };
    this.target = $target;
    this.init();
  }

  init() {
    this.target.innerHTML = $scoreBoardTemplate;
    this.setState({ realtimeScore: 0, bestScore: this.getBestScoreFromSession() });
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
    this.setState({ bestScore: this.getBestScoreFromSession() });
  }

  setScore(score) {
    if (this.isRealtimeScoreBiggerThanBestScore(score)) {
      this.setState({ realtimeScore: score, bestScore: score });
      this.setBestScoreInSession(score);
    } else {
      this.setState({ realtimeScore: score });
    }
  }

  setBestScoreInSession(bestScore) {
    sessionStorage.setItem('bestScore', bestScore);
  }

  getBestScoreFromSession() {
    const bestScore = sessionStorage.getItem('bestScore');
    if (bestScore === null) this.setBestScoreInSession(0);
    return bestScore !== null ? sessionStorage.getItem('bestScore') : 0;
  }

  isRealtimeScoreBiggerThanBestScore(score) {
    return score > this.state.bestScore;
  }
}
