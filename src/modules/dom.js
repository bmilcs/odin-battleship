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
import battleshipHit from '../assets/battleship-hit.svg';
import battleshipSunkSVG from '../assets/battleship-sunk.svg';
import battleshipBoard from '../assets/battleship-board.svg';

//
// page layout
//

// appends <header>, <main> & <footer> to html <body>
const renderLayout = () => {
  containerize(
    document.querySelector('body'),
    prepHeader(),
    main,
    prepFooter()
  );
};

// stored globally to avoid extra dom calls
const main = makeElement('main');

// create <header> and append <h3> <div> to it
const prepHeader = () => {
  return containerize(
    makeElement('header'),
    makeElement(
      'div',
      'header-logo',
      'battleship image',
      '',
      '',
      battleshipIconSVG
    ),
    makeElement('h3', 'header-title', 'Battleship')
  );
};

// create <footer> & append <a> <div> <p> </a> to it
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

// remove all child elements from a parent element
const clearChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};

// clear <main>'s children
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
  APP.resetPlayerObjs();
  APP.startPreGame();
};

//
// pre-game: ship placement
//

// containers for gameboards: stored globally to reduce dom calls
const playerContainer = makeElement('div', 'player-container');
const enemyContainer = makeElement('div', 'enemy-container');

// convert html attribute to coordinate array: required by rest of app
const parseCoordinatesAttr = (coordinatesAttr) => {
  return coordinatesAttr.split('-').map((str) => +str);
};

// render's player's board & add ship placement functionality
const renderPreGame = (player) => {
  const boardArr = player.boardArr();
  const boardObj = player.boardObj();

  // renderPreGame() is called recursively,
  // placeShipSize starts at 5, and decrements down to 2
  const shipSize = player.placeShipList.pop();
  let shipDirection = 'vertical';

  // click: place ship at given coordinate
  const placeShipClickHandler = (e) => {
    const coordinatesAttr = e.target.getAttribute('coordinates');
    if (coordinatesAttr === null) return;

    const startPos = parseCoordinatesAttr(coordinatesAttr);
    const endPos = boardObj.getEndCoordinate(startPos, shipDirection, shipSize);
    const shipCanBePlacedHere = boardObj.canPlaceShipBetween(startPos, endPos);

    if (shipCanBePlacedHere) {
      boardObj.placeShip(startPos, endPos);
      player.placeShipCounter--;
      renderPreGame(player);
    }
  };

  // adds hover effect when hover enters a new cell
  const placeShipMouseEnter = (e) => {
    const coordinatesAttr = e.target.getAttribute('coordinates');
    if (coordinatesAttr === null) return;
    displayHoverEffect(coordinatesAttr);
  };

  // highlights ship placement across multiple cells in the gameboard grid
  const displayHoverEffect = (coordinatesAttr) => {
    const startPos = parseCoordinatesAttr(coordinatesAttr);
    const endPos = boardObj.getEndCoordinate(startPos, shipDirection, shipSize);
    const allCoordinates = boardObj.getAllCoordinatesBetween(startPos, endPos);
    const shipCanBePlacedHere = boardObj.canPlaceShipBetween(startPos, endPos);

    // add styling to a cell based on whether or not its position is
    // empty & within the boundaries of the gameboard
    allCoordinates.forEach((coord) => {
      if (boardObj.areCoordinatesInsideBoard(coord)) {
        const [row, col] = coord;
        if (shipCanBePlacedHere)
          document
            .querySelector(`div[coordinates="${row}-${col}"]`)
            .classList.add('place-hover-valid');
        else
          document
            .querySelector(`div[coordinates="${row}-${col}"]`)
            .classList.add('place-hover-error');
      }
    });
  };

  // remove all hover effects: on mouseleave & rotation change
  const clearAllHoverEffects = () => {
    const allDivs = document.querySelectorAll('.pre-game-cell');
    for (let i = 0; i < allDivs.length; i++) {
      allDivs[i].classList.remove('place-hover-valid');
      allDivs[i].classList.remove('place-hover-error');
    }
  };

  // on hover leaving a cell
  const placeShipMouseLeave = (e) => {
    clearAllHoverEffects();
  };

  // rotate ship event
  const rotateDirectionHandler = (e) => {
    e.preventDefault();
    const coordinatesAttr = e.target.getAttribute('coordinates');
    if (coordinatesAttr === null) return;
    shipDirection === 'vertical'
      ? (shipDirection = 'horizontal')
      : (shipDirection = 'vertical');
    clearAllHoverEffects(coordinatesAttr);
    displayHoverEffect(coordinatesAttr);
  };

  // start game button functionality
  const startGameHandler = () => {
    if (shipSize === undefined) {
      clearMain();
      APP.startGamePlay();
    }
  };

  const placeShipsRandomlyHandler = () => {
    APP.placeShipsRandomly();
  };

  const resetShipPlacementHandler = () => {
    APP.resetPlayerObjs();
    APP.startPreGame();
  };

  // render elements & apply above eventhandlers
  clearChildren(main);

  const startGameBtn = makeElement('button', 'start-game-btn', 'Start Game');
  startGameBtn.addEventListener('click', startGameHandler);

  const placeShipsRandomlyBtn = makeElement(
    'button',
    'place-ships-auto',
    'Auto'
  );
  placeShipsRandomlyBtn.addEventListener('click', placeShipsRandomlyHandler);

  const resetShipPlacementBtn = makeElement(
    'button',
    'reset-ship-placement-btn',
    'Reset'
  );

  resetShipPlacementBtn.addEventListener('click', resetShipPlacementHandler);

  let gameboard;

  // if ships still need to be placed down
  if (shipSize !== undefined) {
    gameboard = prepBoard(boardArr, 'pre-game', placeShipClickHandler);
    gameboard.addEventListener('mouseover', placeShipMouseEnter);
    gameboard.addEventListener('mouseout', placeShipMouseLeave);
    gameboard.addEventListener('contextmenu', rotateDirectionHandler);
  } else {
    // render gameboard without hover/click effects
    gameboard = prepBoard(boardArr, 'pre-game');
  }

  let shipDescription;

  shipSize
    ? (shipDescription = `Place the ${shipSize}x ship on your gameboard. Right click rotates your ship.`)
    : (shipDescription = `Click on Start Game to begin! To start over, click the Reset button.`);

  const pregameBoardContainer = makeElement('div', 'pre-game-board-container');

  containerize(
    main,
    containerize(
      'pre-game-header-container',
      makeElement('h1', 'pregame-header', 'Position Your Fleet'),
      makeElement('p', 'ship-size-description', shipDescription)
    ),
    containerize(pregameBoardContainer, gameboard),
    containerize(
      'pre-game-button-container',
      placeShipsRandomlyBtn,
      startGameBtn,
      resetShipPlacementBtn
    )
  );
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
      // add styling so player can see where ships are placed
      if (player === 'pre-game' || player === 'player') {
        if (typeof cell === 'number') {
          cellDiv.classList.add(`ship-${cell}`);
          cellDiv.innerHTML = battleshipBoard;
        }
      }
      // add styling for hit but not sunk: array value = ship.id & "X"
      // ie: array value of "1X" means: shipObj.id = 1, "X" = hit
      if (cell.toString().includes('X')) {
        cellDiv.classList.add('hit');
        cellDiv.innerHTML = battleshipHit;
      }
      // add styling for sunk ship: "2S": ship.id 2, "S" = sunk
      else if (cell.toString().includes('S')) {
        cellDiv.classList.add('sunk');
        cellDiv.innerHTML = battleshipSunkSVG;
      }
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
  renderEnemyBoardContainer(enemyBoardArr);
  renderPlayerBoardContainer(playerBoardArr);
};

const renderEnemyBoardContainer = (enemyBoardArr) => {
  clearChildren(enemyContainer);
  const enemyBoardElements = prepBoard(
    enemyBoardArr,
    'enemy',
    attackClickHandler
  );
  const h2 = makeElement('h2', 'gameboard-header', 'Fire away!');
  containerize(enemyContainer, h2, enemyBoardElements);
};

const renderPlayerBoardContainer = (playerBoardArr) => {
  clearChildren(playerContainer);
  const playerBoardElements = prepBoard(playerBoardArr, 'player');
  const h2 = makeElement('h2', 'gameboard-header', 'Brace Yourself!');
  containerize(playerContainer, h2, playerBoardElements);
};

const attackClickHandler = (e) => {
  if (APP.getTurn() === 'enemy') return;
  const coordinatesAttr = e.target.getAttribute('coordinates');
  if (coordinatesAttr === null) return;
  const coordinates = parseCoordinatesAttr(coordinatesAttr);
  APP.playerAttack(coordinates);
};

const renderPlayersTurn = () => {
  enemyContainer.classList.add('active');
  playerContainer.classList.remove('active');
};

const renderEnemysTurn = () => {
  enemyContainer.classList.remove('active');
  playerContainer.classList.add('active');
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

  let header;
  let p;

  if (victorName === 'Player') {
    header = 'YOU WIN!';
    p =
      'Congratulations! You have crushed your opponent. Would you like to play another round?';
  } else {
    header = 'YOU LOSE!';
    p =
      'Robots have destroyed your fleet. Dare to challenge them to another round?';
  }

  containerize(
    document.querySelector('body'),
    containerize(
      gameOverModal,
      makeElement('h2', 'gameover-header', header),
      makeElement('p', 'gameover-instructions', p),
      playAgainBtn,
      returnMainMenuBtn
    )
  );
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
  renderPlayersTurn,
  renderEnemysTurn,
};
