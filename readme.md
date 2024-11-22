<p align="center"><img src="./src/assets/snakegame.gif" width=300px height=300px/></p>

### 프로젝트 설명

구글에서 검색하여 플레이할 수 있는 [Snake Game](https://www.google.com/search?q=snakegame&ei=cfLEY7mAIZrf2roPo92h6Ak&ved=0ahUKEwj5_JPjvsv8AhWar1YBHaNuCJ0Q4dUDCA8&uact=5&oq=snakegame&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIHCC4QgAQQCjIHCAAQgAQQCjIHCAAQgAQQCjIHCAAQgAQQCjIHCAAQgAQQCjIHCAAQgAQQCjIHCAAQgAQQCjIGCAAQHhAKMgkIABAeEPEEEAoyBwgAEIAEEAo6CggAEEcQ1gQQsAM6BQgAEIAEOgQIABADOggIABCABBCxAzoLCAAQgAQQsQMQgwE6BQguEIAEOggILhCABBDUAjoLCC4QgAQQsQMQ1AI6CwguEIAEEMcBEK8BOg4ILhCABBCxAxDHARDRAzoECC4QQzoHCC4Q1AIQQzoECAAQQzoKCC4Q1AIQsQMQQzoOCC4QgAQQsQMQgwEQ1AI6CgguELEDENQCEEM6CAguEIAEELEDSgQIQRgASgQIRhgAUJgIWL4hYL4iaAJwAXgBgAGLAYgBkw2SAQQwLjE0mAEAoAEByAEKwAEB&sclient=gws-wiz-serp)을 참고하여 Snake Game을 만들었습니다. Prettier와 ESLint를 사용하여 일관성 있는 코드를 작성하고자 하였고, React의 상태 기반 렌더링에서 착안하여, 각 컴포년트 별 State의 변화에 따른 렌더링이 이루어지도록 구현하였습니다. 또한 Snake가 일정 시간 간격으로 이동하는 기능을 구현하기 위해, setTimeout을 활용하여 Snake가 움직이는 함수를 호출하는 Scheduler를 작성하였고, SessionStorage를 사용하여 세션 내에서 게임 최고 점수가 유지되도록 하였습니다. 뿐만 아니라 게임 하단의 ControlBoard와 게임 종료 시 나타는 Modal에 있는 버튼을 통해 유저가 게임을 중단 / 재시작 / 리셋 할 수 있도록 하였습니다.

### 게임 플레이

- [SnakeGame](https://sunghyun627.github.io/JS-SnakeGame/)

### 프로젝트 세부 정리

- [Snake Game 구현기](https://sunghyun627.tistory.com/entry/JS-SnakeGame-%EA%B5%AC%ED%98%84%EA%B8%B0)

### 기술 스택

- <img src="https://img.shields.io/badge/Javascript-ES6+-red"/>
- <img src="https://img.shields.io/badge/ESLint-8.25.0-red"/> <img src="https://img.shields.io/badge/Prettier-2.7.1-red"/>

### 디렉터리 구조 및 역할

- `index.js` : Entry Point
- `index.html` : 마크업 파일
- `.eslintrc.js` : Project에 적용할 lint rule을 설정한 파일
- `.prettierrc` : Projectd에 적용할 Prettier rule을 설정한 파일
- `.gitignore` : git 버전 관리에서 추적하지 않도록 설정하는 파일
- `package.json` : project 의존성 관리를 위한 명세
- `package-lock.json` : 파일이 생성되는 시점의 의존성 트리에 대한 정보를 가지고 있는 파일
- `src` : Project를 구성하는 assets, components, styles, templates, utils 폴더 및 App 컴포넌트를 포함하는 폴더
  - `App.js` : Project 최상위 Component
  - `assets` : 사용된 asset을 모아놓은 폴더
  - `components` : App을 구성하는 Component
    - `GameTitle.js` : Game Title Component
    - `ScoreBoard.js` : 실시간 점수, 최고 점수가 표시되는 Component
    - `Board.js`: 뱀이 움직이며 게임을 진행하는 Board Component
    - `ControlBoard.js` : Button으로 게임의 재시작 및 reset하는 기능을 가진 Component
    - `Modal.js` : 게임 종료 시 나타나는 Modal Component
  - `constants` : Project 전반에 걸쳐 사용된 Constant를 관리(constants.js)
  - `styles` : Style을 담당하는 폴더(index.css)
  - `templates` : 각 Component들의 초기 template(temmplates.js)
  - `utils`: 여러 유틸 함수
    - `copySnakeQueue.js` : SnakeQueue를 순회하여 새로운 SnakeQueue를 만드는 함수
    - `createApplePosition.js` : 사과의 위치를 랜덤으로 생성하는 함수
    - `createElements.js` : element(cell, apple)를 생성하는 함수
    - `debounce.js` : 연속된 방향키 입력을 하나의 입력으로 그룹화하기 위한 debounce 함수
    - `elementSelector.js` : 특정 element를 selector하는 함수
    - `getPositions.js` : cell의 좌표, 뱀의 head가 위치할 다음 셀의 좌표를 반환하는 함수
    - `getScore.js` : 점수를 계산하는 함수
    - `manipulateClass.js` : element에 class를 추가/삭제하는 함수
    - `render.js` : 렌더링에 필요한 함수
    - `scheduler.js` : 뱀의 이동하는 함수의 호출을 결정하는 Scheduler(Timer)
    - `sessionStorage.js` : sessionStoarge에 value를 get/set하는 함수
    - `snakeDirection.js` : 뱀 head의 방향을 구하는 함수
    - `validation.js` : 방향, 게임 State, 뱀의 충돌 조건 등 특정 조건이 Valid한지 체크
