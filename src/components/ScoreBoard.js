export default class ScoreBoard {
  constructor({ container, ...props }) {
    this.container = container;
    this.props = props;
    this.state = { realTimeScore: 0, bestScore: this.getBestScoreSession() };
    this.initScoreBoard();
  }

  initScoreBoard() {
    const scoreBoardContainer = document.createElement('div');
    scoreBoardContainer.classList.add('score-board__container');

    const realTimeScore = document.createElement('div');
    realTimeScore.classList.add('realtime__score');

    const realTimeScoreIcon = document.createElement('img');
    realTimeScoreIcon.classList.add('score__icon');
    realTimeScoreIcon.setAttribute('src', 'src/assets/apple.svg');

    const realTimeScoreText = document.createElement('div');
    realTimeScoreText.classList.add('score__text');
    realTimeScoreText.innerHTML = this.state.realTimeScore;

    const bestScore = document.createElement('div');
    bestScore.classList.add('best__score');

    const bestScoreIcon = document.createElement('img');
    bestScoreIcon.classList.add('score__icon');
    bestScoreIcon.setAttribute('src', 'src/assets/trophy.svg');

    const bestScoreText = document.createElement('div');
    bestScoreText.classList.add('score__text');
    bestScoreText.innerHTML = this.state.bestScore;

    realTimeScore.appendChild(realTimeScoreIcon);
    realTimeScore.appendChild(realTimeScoreText);

    bestScore.appendChild(bestScoreIcon);
    bestScore.appendChild(bestScoreText);

    scoreBoardContainer.appendChild(realTimeScore);
    scoreBoardContainer.appendChild(bestScore);

    this.container.appendChild(scoreBoardContainer);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  init() {
    this.setState({ realTimeScore: 0, bestScore: 0 });
    this.setBestScoreSession(0);
  }

  resetRealTimeScore() {
    this.setState({ realTimeScore: 0 });
  }

  render() {
    const realTimeScoreTextElement = document.querySelector('.realtime__score .score__text');
    const bestScoreTextElement = document.querySelector('.best__score .score__text');
    // console.log(realTimeScoreTextElement, bestScoreTextElement);
    realTimeScoreTextElement.innerHTML = this.state.realTimeScore;
    bestScoreTextElement.innerHTML = this.state.bestScore;
  }

  printScore(score) {
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
