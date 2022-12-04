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
  placeEnemyShips();
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
};

const placeEnemyShips = () => {
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

const playerAttack = (coordinates) => {
  // capture result of a player's attack
  const attackResults = player.attack(coordinates, enemy.boardObj());

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

export { start, startPreGame, startGamePlay, playerAttack };
