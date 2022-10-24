export default class ScoreBoard {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const scoreBoardContainer = document.createElement('div');
    scoreBoardContainer.classList.add('score-board__container');

    const realTimeScore = document.createElement('div');
    realTimeScore.classList.add('realtime__score');

    const realTimeScoreIcon = document.createElement('img');
    realTimeScoreIcon.classList.add('score__icon');
    realTimeScoreIcon.setAttribute('src', 'src/assets/apple.svg');

    const realTimeScoreText = document.createElement('div');
    realTimeScoreText.classList.add('score__text');
    realTimeScoreText.innerHTML = 0;

    const bestScore = document.createElement('div');
    bestScore.classList.add('best__score');

    const bestScoreIcon = document.createElement('img');
    bestScoreIcon.classList.add('score__icon');
    bestScoreIcon.setAttribute('src', 'src/assets/trophy.svg');

    const bestScoreText = document.createElement('div');
    bestScoreText.classList.add('score__text');
    bestScoreText.innerHTML = 0;

    realTimeScore.appendChild(realTimeScoreIcon);
    realTimeScore.appendChild(realTimeScoreText);

    bestScore.appendChild(bestScoreIcon);
    bestScore.appendChild(bestScoreText);

    scoreBoardContainer.appendChild(realTimeScore);
    scoreBoardContainer.appendChild(bestScore);

    container.appendChild(scoreBoardContainer);
  }
}
