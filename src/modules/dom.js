import containerize from './utility/containerize';
import makeElement from './utility/make-element';
import * as APP from './app';
import '../scss/index.scss';
import '../scss/footer.scss';
import '../scss/menu.scss';
import githubSVG from '../assets/github.svg';
import battleshipIconSVG from '../assets/battleship-icon.svg';
import battleshipAction from '../assets/battleship-action.jpg';

//
// main layout
//

const renderLayout = () => {
  containerize(
    document.querySelector('body'),
    prepHeader(),
    main,
    prepFooter()
  );
};

const prepHeader = () => {
  return containerize(
    makeElement('header'),
    makeElement('h3', 'header-title', 'Battleship'),
    makeElement(
      'div',
      'header-logo',
      'battleship image',
      '',
      '',
      battleshipIconSVG
    )
  );
};

const prepMain = () => {
  return makeElement('main');
};

const main = prepMain();

const prepFooter = () => {
  return containerize(
    makeElement('footer'),
    containerize(
      makeElement('a', '', '', '', 'https://github.com/bmilcs/odin-battleship'),
      makeElement('div', 'github-svg', 'GitHub Logo', '', '', githubSVG),
      makeElement('p', 'footer-p', 'bmilcs')
    )
  );
};

const clearChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};

const clearMain = () => clearChildren(main);

//
// main menu
//

const renderMainMenu = () => {
  const startPreGameBtn = makeElement('button', 'start-btn', 'Start Game');
  startPreGameBtn.addEventListener('click', startPreGameHandler);

  containerize(
    main,
    containerize(
      'main-menu-card',
      prepMainLogo(),
      makeElement(
        'p',
        'instructions',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum impedit necessitatibus distinctio corrupti porro fugiat, odit vitae soluta itaque consequuntur at sed eveniet pariatur explicabo consectetur incidunt! Maxime ullam ipsa, laudantium possimus perspiciatis omnis pariatur velit odio eveniet sint repellendus minus, tenetur expedita dolores delectus eos doloribus saepe illo impedit?'
      ),
      startPreGameBtn
    )
  );
};

const prepMainLogo = () => {
  return containerize(
    'main-logo-container',
    makeElement('img', 'main-img', 'battleship image', '', battleshipAction),
    containerize(
      'logo-text-container',
      makeElement('h1', 'main-title', 'Battleship'),
      makeElement('p', 'main-subtitle', 'The Classic Naval Combat Game')
    )
  );
};

const startPreGameHandler = () => {
  APP.startPreGame();
};

//
// pre-game: ship placement
//

// stored globally to reduce dom calls
const playerContainer = makeElement('div', 'player-container');
const enemyContainer = makeElement('div', 'enemy-container');

const renderPreGame = (boardArr) => {
  // start game button
  const startGamePlayBtn = makeElement(
    'button',
    'start-game-play-btn',
    'Start Game'
  );
  startGamePlayBtn.addEventListener('click', startGameHandler);

  // pregame place ship gameboard
  const preGameboardContainer = makeElement('div', 'pre-game-container');
  const gameboard = prepBoard(boardArr, 'player', preGameClickHandler);
  preGameboardContainer.appendChild(gameboard);

  containerize(
    main,
    makeElement('h1', 'pregame-header', 'Pre-Game Setup'),
    preGameboardContainer,
    startGamePlayBtn
  );
};

const startGameHandler = (e) => {
  // if all ships have been placed ...
  clearChildren(main);
  APP.startGamePlay();
};

const prepBoard = (boardArr, player, clickCallback) => {
  // boardArr: [
  //        row: [
  //               cell, cell
  //             ], ...

  // map row arrays to row div containers
  const assembledRowDivs = boardArr.map((row, y) => {
    const rowDiv = makeElement('div', `gameboard-row ${player}-row`);
    // map each cell to its own div
    const cellDivs = row.map((cell, x) => {
      const cellDiv = makeElement('div', `gameboard-cell ${player}-cell`);
      cellDiv.setAttribute('coordinates', `${y}-${x}`);
      if (cell === 'X') cellDiv.classList.add('hit');
      else if (cell === 'M') cellDiv.classList.add('miss');
      return cellDiv;
    });

    // append all cells to parent rowDiv
    return containerize(rowDiv, cellDivs);
  });

  // append all rows to a parent gameboard div container
  const assembledBoard = containerize(
    `gameboard-container ${player}-gameboard`,
    assembledRowDivs
  );

  if (clickCallback) assembledBoard.addEventListener('click', clickCallback);
  return assembledBoard;
};

const preGameClickHandler = (e) => {
  alert(e.target.getAttribute('coordinates'));
};

//
// game mode
//

const renderGamePlayMode = () => {
  containerize(
    main,
    containerize('gameplay-container', enemyContainer, playerContainer)
  );
};

const renderPlayerBoard = (boardArr) => {
  const gameboard = prepBoard(boardArr, 'player');
  clearChildren(playerContainer);
  playerContainer.appendChild(gameboard);
};

const renderEnemyBoard = (boardArr) => {
  const gameboard = prepBoard(boardArr, 'enemy', gamePlayClickHandler);
  clearChildren(enemyContainer);
  enemyContainer.appendChild(gameboard);
};

const gamePlayClickHandler = (e) => {
  const coordinates = e.target.getAttribute('coordinates');
  APP.attackCoordinates(coordinates);
};

export {
  renderLayout,
  renderMainMenu,
  renderPreGame,
  renderGamePlayMode,
  renderPlayerBoard,
  renderEnemyBoard,
  clearMain,
};
