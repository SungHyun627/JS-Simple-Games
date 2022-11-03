export default class Modal {
  constructor(container) {
    this.container = container;
    this.render(container);
  }

  render(container) {
    const modalConatiner = document.createElement('div');
    modalConatiner.classList.add('modal__container');

    const modalSnakeIcon = document.createElement('img');
    modalSnakeIcon.classList.add('modal__snake__icon');
    modalSnakeIcon.setAttribute('src', 'src/assets/snake-icon-black.svg');

    const modalGameOverText = document.createElement('div');
    modalGameOverText.classList.add('modal__gameover__text');
    modalGameOverText.innerHTML = 'Game Over';

    const modalScoreResult = document.createElement('div');
    modalScoreResult.classList.add('modal__score__result');

    const modalRealTimeScore = document.createElement('div');
    modalRealTimeScore.classList.add('modal__realtime__score');

    const modalRealTimeScoreIcon = document.createElement('img');
    modalRealTimeScoreIcon.classList.add('score__icon');
    modalRealTimeScoreIcon.setAttribute('src', 'src/assets/apple.svg');

    const modalRealTimeScoreText = document.createElement('div');
    modalRealTimeScoreText.classList.add('score__text');
    modalRealTimeScoreText.innerHTML = 1000;

    modalRealTimeScore.appendChild(modalRealTimeScoreIcon);
    modalRealTimeScore.appendChild(modalRealTimeScoreText);

    const modalBestScore = document.createElement('div');
    modalBestScore.classList.add('modal__best__score');

    const modalBestScoreIcon = document.createElement('img');
    modalBestScoreIcon.classList.add('score__icon');
    modalBestScoreIcon.setAttribute('src', 'src/assets/trophy.svg');

    const modalBestScoreText = document.createElement('div');
    modalBestScoreText.classList.add('score__text');
    modalBestScoreText.innerHTML = 1000;

    modalBestScore.appendChild(modalBestScoreIcon);
    modalBestScore.appendChild(modalBestScoreText);

    modalScoreResult.appendChild(modalRealTimeScore);
    modalScoreResult.appendChild(modalBestScore);

    const modalControlButtons = document.createElement('div');
    modalControlButtons.classList.add('modal__control__btns');

    const modalRestartButton = document.createElement('button');
    modalRestartButton.classList.add('modal__restart__btn');
    modalRestartButton.innerHTML = 'Restart Game';

    const modalStopPlayingButton = document.createElement('button');
    modalStopPlayingButton.classList.add('modal__stopplaying__btn');
    modalStopPlayingButton.innerHTML = 'Stop Playing';

    modalControlButtons.appendChild(modalRestartButton);
    modalControlButtons.appendChild(modalStopPlayingButton);

    modalConatiner.appendChild(modalSnakeIcon);
    modalConatiner.appendChild(modalGameOverText);
    modalConatiner.appendChild(modalScoreResult);
    modalConatiner.appendChild(modalControlButtons);

    container.appendChild(modalConatiner);
  }
}
