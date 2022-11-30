import * as DOM from './dom';
import * as Player from './player';

let player;
let enemy;

const start = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
  startPreGame();
};

const startPreGame = () => {
  resetPlayerObjs();
  DOM.clearMain();
  setupPlayerShips();
  DOM.renderPreGame(player.boardArr());
  // DOM.renderPlayerBoard(player.boardArr());
};

const setupPlayerShips = () => {
  const playerBoard = player.boardObj();
  playerBoard.placeShip([1, 1], [1, 5]);
  playerBoard.placeShip([3, 0], [5, 0]);
  playerBoard.placeShip([8, 5], [8, 9]);
  playerBoard.placeShip([6, 5], [5, 5]);
  playerBoard.placeShip([3, 9], [3, 7]);

  const enemyBoard = enemy.boardObj();
  enemyBoard.placeShip([2, 1], [2, 5]);
  enemyBoard.placeShip([9, 3], [7, 3]);
  enemyBoard.placeShip([1, 3], [1, 6]);
  enemyBoard.placeShip([6, 5], [5, 5]);
  enemyBoard.placeShip([3, 9], [3, 7]);
};

const startGamePlay = () => {
  // ships are placed, user begins game
  DOM.clearMain();
  DOM.renderGamePlayMode();
  DOM.renderEnemyBoard(enemy.boardArr());
  DOM.renderPlayerBoard(player.boardArr());
};

const attackCoordinates = (coordinates) => {
  // split html attribute ie: 1-5 & convert to #s
  const coordinatesArr = coordinates.split('-').map((str) => +str);
  const isHit = player.attack(coordinatesArr, enemy.boardObj());
  startGamePlay();
  if (!isHit) {
    // disable players turn
    enemyAttack();
  }
};

const enemyAttack = () => {
  const isHit = enemy.randomAttack(player.boardObj());
  startGamePlay();

  if (isHit) enemyAttack();
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
};

export { start, startPreGame, startGamePlay, attackCoordinates };
