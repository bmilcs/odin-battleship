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

// create <footer> & append <a><div><p></a> to it
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

//
// utility functions
//

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

  // create <div class='main-menu-card'> and append <p> & <button> to it
  const mainMenuCard = containerize(
    'main-menu-card',
    prepMainLogo(),
    makeElement(
      'p',
      'instructions',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum impedit necessitatibus distinctio corrupti porro fugiat, odit vitae soluta itaque consequuntur at sed eveniet pariatur explicabo consectetur incidunt! Maxime ullam ipsa, laudantium possimus perspiciatis omnis pariatur velit odio eveniet sint repellendus minus, tenetur expedita dolores delectus eos doloribus saepe illo impedit?'
    ),
    startPreGameBtn
  );

  // append assembled main menu to <main>
  containerize(main, mainMenuCard);
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

// convert html attribute to coordinate array: required by rest of app
// ie: '5-1' to [5, 1]
const parseCoordinatesAttr = (coordinatesAttr) => {
  return coordinatesAttr.split('-').map((str) => +str);
};

// containers for gameboards: stored globally to reduce dom calls
const playerContainer = makeElement('div', 'player-container');
const enemyContainer = makeElement('div', 'enemy-container');

// render pregame ship placement mode:
// renders player's gameboard & allows for manual & automatic ship placement
const renderPreGame = (player) => {
  const boardArr = player.boardArr();
  const boardObj = player.boardObj();

  // renderPreGame() is called recursively: placeShipList = [5, 4, 3, 3, 2]
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
      // recursively call renderPreGame() w/ newly placed ship
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

    // add styling to a cell based on whether or not its ship coordinates are
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

  // on mouse hover leaving a cell
  const placeShipMouseLeave = () => {
    clearAllHoverEffects();
  };

  // rotate ship event: occurs on right click
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
    // prevent starting the game until all ships are placed
    // shipSize becomes undefined when the last ship is placed: placeShipList.pop()
    if (shipSize !== undefined) return;
    clearMain();
    APP.startGamePlay();
  };

  const placeShipsAutomaticallyHandler = () => {
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

  const placeShipsAutomaticallyBtn = makeElement(
    'button',
    'place-ships-auto',
    'Auto'
  );
  placeShipsAutomaticallyBtn.addEventListener(
    'click',
    placeShipsAutomaticallyHandler
  );

  const resetShipPlacementBtn = makeElement(
    'button',
    'reset-ship-placement-btn',
    'Reset'
  );
  resetShipPlacementBtn.addEventListener('click', resetShipPlacementHandler);

  let gameboard;

  // if ships still need to be placed down, add all event handlers to the gameboard
  if (shipSize !== undefined) {
    gameboard = prepBoard(boardArr, 'pre-game', placeShipClickHandler);
    gameboard.addEventListener('mouseover', placeShipMouseEnter);
    gameboard.addEventListener('mouseout', placeShipMouseLeave);
    gameboard.addEventListener('contextmenu', rotateDirectionHandler);
  } else {
    // otherwise, render gameboard without hover/click effects
    gameboard = prepBoard(boardArr, 'pre-game');
  }

  let preGameInstructions;

  shipSize
    ? (preGameInstructions = `Place the ${shipSize}x ship on your gameboard. Note: Right click rotates your ship.`)
    : (preGameInstructions = `Click on Start Game to begin! To start over, click the Reset button.`);

  // append the above content to the <main> element
  containerize(
    main,
    containerize(
      'pre-game-header-container',
      makeElement('h1', 'pregame-header', 'Position Your Fleet'),
      makeElement('p', 'pregame-instructions', preGameInstructions)
    ),
    containerize('pre-game-board-container', gameboard),
    containerize(
      'pre-game-button-container',
      placeShipsAutomaticallyBtn,
      startGameBtn,
      resetShipPlacementBtn
    )
  );
};

// create gameboard from a player/computer gameboard array
// and add a click event handler

const prepBoard = (boardArr, playerNameOrMode, clickCallback) => {
  // boardArr [
  //          row #1 [ cell, cell, cell... ]
  //          row #2 [ cell, cell, cell... ]

  // map row arrays to row div containers
  const assembledRowDivsArr = boardArr.map((row, y) => {
    const rowDiv = makeElement('div', `gameboard-row ${playerNameOrMode}-row`);

    // within each row array, map each cell to its own div
    const cellDivsArr = row.map((cellValue, x) => {
      const cellDiv = makeElement(
        'div',
        `gameboard-cell ${playerNameOrMode}-cell`
      );

      // add an attribute that corresponds to its position within the gameboard Array
      cellDiv.setAttribute('coordinates', `${y}-${x}`);

      // add styling so player can see where their ships are placed
      if (playerNameOrMode === 'pre-game' || playerNameOrMode === 'player') {
        // pure number types in a gameboard array indicate that an unhit ship exists in this cell
        // the # value is the shipObj.id
        if (typeof cellValue === 'number') {
          cellDiv.classList.add(`ship-${cellValue}`);
          cellDiv.innerHTML = battleshipBoard;
        }
      }

      // add styling for hit but not sunk ship
      // ie: array value of "1X": shipObj.id = 1, "X" = hit
      if (cellValue.toString().includes('X')) {
        cellDiv.classList.add('hit');
        cellDiv.innerHTML = battleshipHit;
      }

      // add styling for sunk ship:
      // ie: array value of "2S": ship.id = 2, "S" = sunk
      else if (cellValue.toString().includes('S')) {
        cellDiv.classList.add('sunk');
        cellDiv.innerHTML = battleshipSunkSVG;
      }

      // add styling for missed attacks: "M"
      else if (cellValue === 'M') cellDiv.classList.add('miss');

      // return cellDiv to its parent row array
      return cellDiv;
    });

    // append the array of cell <div>'s to its parent row <div>
    // finally resulting in an array of fully assembled row divs filled with cell divs
    return containerize(rowDiv, cellDivsArr);
  });

  // append all rows to a parent gameboard div container
  const assembledGameboard = containerize(
    `gameboard-container ${playerNameOrMode}-gameboard`,
    assembledRowDivsArr
  );

  // add callback function as click event handler
  if (clickCallback)
    assembledGameboard.addEventListener('click', clickCallback);

  return assembledGameboard;
};

//
// game play
//

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
