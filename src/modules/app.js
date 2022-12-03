import * as DOM from './dom';
import * as Player from './player';

const start = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
};

let player;
let enemy;

const startPreGame = () => {
  resetPlayerObjs();
  DOM.renderPreGame(player);
  // placeShipsPredefined();
};

const placeShipsTest = () => {
  const playerBoard = player.boardObj();
  playerBoard.placeShip([0, 0], [0, 0]);
  playerBoard.placeShip([3, 0], [5, 0]);
  playerBoard.placeShip([8, 5], [8, 9]);
  playerBoard.placeShip([6, 5], [5, 5]);
  playerBoard.placeShip([3, 9], [3, 7]);

  const enemyBoard = enemy.boardObj();
  enemyBoard.placeShip([0, 0], [0, 0]);
  enemyBoard.placeShip([2, 1], [2, 5]);
  enemyBoard.placeShip([9, 3], [7, 3]);
  enemyBoard.placeShip([1, 3], [1, 6]);
  enemyBoard.placeShip([6, 5], [5, 5]);
  enemyBoard.placeShip([3, 9], [3, 7]);
};

const startGamePlay = () => {
  // ships are placed, user begins game
  DOM.renderGameModeLayout();
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
};

//
// Game Play Mode
//

const playerAttack = (coordinatesAttr) => {
  // convert coordinates: html attribute string to array of numbers
  const coordinatesArr = parseCoordinatesAttr(coordinatesAttr);

  // capture result of a player's attack
  const attackResults = player.attack(coordinatesArr, enemy.boardObj());

  // update screen w/ results of the attack
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());

  if (attackResults === 'game over') declareVictor('Player');
  else if (attackResults === 'miss') initiateEnemyAttack();
};

// recursively attack at random until a miss or victory occurs
const initiateEnemyAttack = (attackResults) => {
  if (attackResults === 'miss') return;
  if (attackResults === 'game over') {
    declareVictor('Computer');
    return;
  }

  initiateEnemyAttack(enemy.randomAttack(player.boardObj()));
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
};

const declareVictor = (victorName) => {
  DOM.renderGameWinner(victorName);
};

const parseCoordinatesAttr = (coordinatesAttr) => {
  return coordinatesAttr.split('-').map((str) => +str);
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
};

export {
  start,
  startPreGame,
  startGamePlay,
  playerAttack,
  parseCoordinatesAttr,
};
