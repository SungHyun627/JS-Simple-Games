export default class ScoreBoard {
  constructor({ container, ...props }) {
    this.container = container;
    this.props = props;
    this.realTimeScore = 0;
    this.bestScore = 0;
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
    realTimeScoreText.innerHTML = this.realTimeScore;

    const bestScore = document.createElement('div');
    bestScore.classList.add('best__score');

    const bestScoreIcon = document.createElement('img');
    bestScoreIcon.classList.add('score__icon');
    bestScoreIcon.setAttribute('src', 'src/assets/trophy.svg');

    const bestScoreText = document.createElement('div');
    bestScoreText.classList.add('score__text');
    bestScoreText.innerHTML = this.bestScore;

    realTimeScore.appendChild(realTimeScoreIcon);
    realTimeScore.appendChild(realTimeScoreText);

    bestScore.appendChild(bestScoreIcon);
    bestScore.appendChild(bestScoreText);

    scoreBoardContainer.appendChild(realTimeScore);
    scoreBoardContainer.appendChild(bestScore);

    this.container.appendChild(scoreBoardContainer);
  }

  render() {
    const realTimeScoreTextElement = document.querySelector('.realtime__score .score__text');
    const bestScoreTextElement = document.querySelector('.best__score .score__text');
    console.log(realTimeScoreTextElement, bestScoreTextElement);
    realTimeScoreTextElement.innerHTML = this.realTimeScore;
    bestScoreTextElement.innerHTML = this.bestScore;
  }

  printRealTimeScore(score) {
    this.realTimeScore = score;
    this.render();
  }
}
