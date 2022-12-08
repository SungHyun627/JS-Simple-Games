import { $scoreBoardTemplate } from '../utils/templates.js';

export default class ScoreBoard {
  constructor({ $target }) {
    this.state = { realTimeScore: 0, bestScore: this.getBestScoreSession() };
    this.target = $target;
    this.init();
  }

  init() {
    this.target.innerHTML = $scoreBoardTemplate;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  resetRealTimeScore() {
    this.setState({ realTimeScore: 0 });
  }

  render() {
    const realTimeScoreTextElement = document.querySelector(
      '.realtime__score .scoreboard__score__text'
    );
    const bestScoreTextElement = document.querySelector('.best__score .scoreboard__score__text');
    realTimeScoreTextElement.innerHTML = this.state.realTimeScore;
    bestScoreTextElement.innerHTML = this.state.bestScore;
  }

  setScore(score) {
    if (this.isRealTimeScoreBiggerThanBestScore(score)) {
      this.setState({ realTimeScore: score, bestScore: score });
      this.setBestScoreSession(score);
    } else {
      this.setState({ realTimeScore: score });
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

  isRealTimeScoreBiggerThanBestScore(score) {
    return score > this.state.bestScore;
  }
}
