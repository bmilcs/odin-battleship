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
  DOM.renderPreGame(player.boardArr());
  setupPlayerShips();
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
  DOM.renderGameModeLayout();
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
};

//
// Game Play Mode
//

const playerAttack = (coordinatesAttr) => {
  // convert coordinates: html attribute string to array of numbers
  const coordinatesArr = coordinatesAttr.split('-').map((str) => +str);

  // prevent repeat attacks on the same position
  const repeatPlay = player.isRepeatPlay(coordinatesArr);
  if (repeatPlay) return;

  // capture result of a player's attack
  const isHit = player.attack(coordinatesArr, enemy.boardObj());

  // update screen w/ results of the attack
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());

  // check for a winner

  if (!isHit) {
    initiateEnemyAttack();
  }
};

// recursively attack at random until a miss occurs
const initiateEnemyAttack = (isHit = 1) => {
  if (!isHit) return;

  // check for a winner

  // randomAttack returns true on hit, false on miss
  initiateEnemyAttack(enemy.randomAttack(player.boardObj()));
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
};

const hasLost = (player) => {
  alert('winner winner chicken dinner');
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
};

export { start, startPreGame, startGamePlay, playerAttack };
