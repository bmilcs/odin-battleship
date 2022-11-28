import * as DOM from './dom';
import * as Player from './player';

let user;
let computer;

const start = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
  startNewGame();
};

const startNewGame = () => {
  DOM.clearMain();
  DOM.renderGameplayMode();
  resetPlayerObjs();
  setupPlayerShips();
  DOM.renderUserBoard(user.boardArr());
  DOM.renderComputerBoard(computer.boardArr());
};

const setupPlayerShips = () => {
  const userBoard = user.boardObj();
  userBoard.placeShip([1, 1], [1, 5]);
  userBoard.placeShip([3, 0], [5, 0]);
  userBoard.placeShip([8, 5], [8, 9]);
  userBoard.placeShip([6, 5], [5, 5]);
  userBoard.placeShip([3, 9], [3, 7]);

  const compBoard = user.boardObj();
  compBoard.placeShip([1, 1], [1, 5]);
  compBoard.placeShip([3, 0], [5, 0]);
  compBoard.placeShip([8, 5], [8, 9]);
  compBoard.placeShip([6, 5], [5, 5]);
  compBoard.placeShip([3, 9], [3, 7]);
};

const resetPlayerObjs = () => {
  user = Player.Player();
  computer = Player.Computer();
};

export { start, startNewGame };
