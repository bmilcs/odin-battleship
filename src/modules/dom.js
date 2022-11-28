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
  const startGameBtn = makeElement('button', 'start-btn', 'Start Game');
  startGameBtn.addEventListener('click', startGameHandler);

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
      startGameBtn
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

const startGameHandler = () => {
  APP.startNewGame();
};

//
// game play
//

// stored globally to reduce dom calls
const userContainer = makeElement('div', 'player-container');
const computerContainer = makeElement('div', 'computer-container');

const renderGameplayMode = () => {
  containerize(
    main,
    containerize('gameplay-container', computerContainer, userContainer)
  );
};

const renderUserBoard = (boardArr) => {
  const gameboard = prepBoard(boardArr, 'user');
  clearChildren(userContainer);
  userContainer.appendChild(gameboard);
};

const renderComputerBoard = (boardArr) => {
  const gameboard = prepBoard(boardArr, 'computer');
  clearChildren(computerContainer);
  computerContainer.appendChild(gameboard);
};

const prepBoard = (boardArr, player) => {
  // boardArr: [
  //        row: [
  //               cell, cell
  //             ], ...

  // map row arrays to row div containers
  const assembledRowDivs = boardArr.map((row, y) => {
    const rowDiv = makeElement('div', `gameboard-row ${player}-row`);
    // map each cell to its own div
    const cellDivs = row.map((cell, x) => {
      const cellDiv = makeElement('div', `gameboard-cell ${player}-cell`, cell);
      cellDiv.setAttribute('coordinates', `${y}-${x}`);
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

  // single eventListener for all board clicks
  assembledBoard.addEventListener('click', boardClickHandler);
  return assembledBoard;
};

const boardClickHandler = (e) => {
  alert(e.target.getAttribute('coordinates'));
};

export {
  renderLayout,
  renderMainMenu,
  renderGameplayMode,
  renderUserBoard,
  renderComputerBoard,
  clearMain,
};
