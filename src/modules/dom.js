import containerize from './utility/containerize';
import makeElement from './utility/make-element';
import * as APP from './app';
import '../scss/index.scss';
import '../scss/footer.scss';
import '../scss/gameplay.scss';
import '../scss/gameover.scss';
import '../scss/menu.scss';
import githubSVG from '../assets/github.svg';
import battleshipIconSVG from '../assets/battleship-icon.svg';
import battleshipAction from '../assets/battleship-action.jpg';

//
// page layout
//

const renderLayout = () => {
  // appends <header>, <main> & <footer> to html <body>
  containerize(
    document.querySelector('body'),
    prepHeader(),
    main,
    prepFooter()
  );
};

const prepMain = () => {
  return makeElement('main');
};

// stored globally to prevent excessive dom calls
const main = prepMain();

const prepHeader = () => {
  // create <header> and append <h3> <div> to it
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

const prepFooter = () => {
  // create <footer> & append <a> <div> <p> to it
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

const startPreGameHandler = () => APP.startPreGame();

//
// pre-game: ship placement
//

// stored globally to reduce dom calls
const playerContainer = makeElement('div', 'player-container');
const enemyContainer = makeElement('div', 'enemy-container');

const renderPreGame = (boardArr) => {
  clearChildren(main);

  // start game button
  const startGamePlayBtn = makeElement(
    'button',
    'start-game-play-btn',
    'Start Game'
  );
  startGamePlayBtn.addEventListener('click', startGameHandler);

  // pregame place ship: player's gameboard
  const preGameboardContainer = makeElement('div', 'pre-game-container');
  const gameboard = prepBoard(boardArr, 'pregame', preGameClickHandler);
  preGameboardContainer.appendChild(gameboard);

  containerize(
    main,
    makeElement('h1', 'pregame-header', 'Pre-Game Setup'),
    preGameboardContainer,
    startGamePlayBtn
  );
};

// pregame: place ships functionality
const preGameClickHandler = (e) => {
  alert(e.target.getAttribute('coordinates'));
};

// start game button functionality
const startGameHandler = (e) => {
  // if all ships have been placed ...
  clearMain();
  APP.startGamePlay();
};

// create gameboard from a player/computer gameboard array
// and add a click event handler:
//    boardArr: [
//           row: [
//                  cell, cell
//                ], ...

const prepBoard = (boardArr, player, clickCallback) => {
  // map row arrays to row div containers
  const assembledRowDivs = boardArr.map((row, y) => {
    const rowDiv = makeElement('div', `gameboard-row ${player}-row`);

    // map each cell to its own div
    const cellDivs = row.map((cell, x) => {
      const cellDiv = makeElement('div', `gameboard-cell ${player}-cell`);
      // attribute: coordinates that align with the gameboard Array
      cellDiv.setAttribute('coordinates', `${y}-${x}`);
      // add styling for hit but not sunk: array value = ship.id & "X"
      // ie: array value of "1X" means: shipObj.id = 1, "X" = hit
      if (cell.toString().includes('X')) cellDiv.classList.add('hit');
      // add styling for sunk ship: "2S": ship.id 2, "S" = sunk
      else if (cell.toString().includes('S')) cellDiv.classList.add('sunk');
      // add styling for misses: "M"
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

  // add callback function as click event handler
  if (clickCallback) assembledBoard.addEventListener('click', clickCallback);

  return assembledBoard;
};

//
// game play
//

const renderGameModeLayout = () => {
  clearMain();
  containerize(
    main,
    containerize('gameplay-container', enemyContainer, playerContainer)
  );
};

const renderGameboardChanges = (enemyBoardArr, playerBoardArr) => {
  clearChildren(playerContainer);
  clearChildren(enemyContainer);
  const enemyBoardElements = prepBoard(
    enemyBoardArr,
    'enemy',
    attackClickHandler
  );
  const playerBoardElements = prepBoard(playerBoardArr, 'player');
  enemyContainer.appendChild(enemyBoardElements);
  playerContainer.appendChild(playerBoardElements);
};

const attackClickHandler = (e) => {
  const coordinates = e.target.getAttribute('coordinates');
  if (coordinates === null) return;
  APP.playerAttack(coordinates);
};

//
// game over
//

const renderGameWinner = (victorName) => {
  const gameOverModal = makeElement('div', 'game-over-modal');
  const playAgainBtn = makeElement('button', 'play-again-btn', 'Play Again');
  playAgainBtn.addEventListener('click', playAgainClickHandler);
  const returnMainMenuBtn = makeElement(
    'button',
    'return-main-menu-btn',
    'Main Menu'
  );
  returnMainMenuBtn.addEventListener('click', returnMainMenuHandler);

  containerize(
    gameOverModal,
    makeElement('h2', 'gameover-header', `${victorName} is the winner!`),
    makeElement(
      'p',
      'gameover-instructions',
      'Congratulations! You have crushed your opponent. Would you like to play another round?'
    ),
    playAgainBtn,
    returnMainMenuBtn
  );
  containerize(document.querySelector('body'), gameOverModal);
};

const closeGameWinner = () => {
  const gameOverModal = document.querySelector('.game-over-modal');
  gameOverModal.remove();
};

const playAgainClickHandler = (e) => {
  closeGameWinner();
  APP.playAgain();
};
const returnMainMenuHandler = (e) => {
  closeGameWinner();
  clearMain();
  renderMainMenu();
};

export {
  renderLayout,
  renderMainMenu,
  renderPreGame,
  renderGameModeLayout,
  renderGameboardChanges,
  renderGameWinner,
};
