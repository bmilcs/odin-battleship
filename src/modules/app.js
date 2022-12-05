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
  // placeShipsTest();
  enemy.placeShipsRandomly();
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
};

const startGamePlay = () => {
  DOM.renderGameModeLayout();
  DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
};

const placeShipsTest = () => {
  const playerBoard = player.boardObj();
  playerBoard.placeShip([0, 0], [0, 0]);
  playerBoard.placeShip([2, 1], [2, 5]);
  playerBoard.placeShip([9, 3], [7, 3]);
  playerBoard.placeShip([1, 3], [1, 6]);
  playerBoard.placeShip([6, 5], [5, 5]);
  playerBoard.placeShip([3, 9], [3, 7]);
  startGamePlay();
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
  // DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
  setTimeout(() => {
    initiateEnemyAttack(enemy.smartAttack(player.boardObj()));
    DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
  }, 200);
};

const declareVictor = (victorName) => {
  DOM.renderGameWinner(victorName);
};

export { start, startPreGame, startGamePlay, playerAttack };
