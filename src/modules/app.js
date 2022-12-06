import * as DOM from './dom';
import * as Player from './player';

const start = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
  resetPlayerObjs();
  // startPreGame();
};

let player;
let enemy;
let turn;

const startPreGame = () => {
  DOM.renderPreGame(player);
  // placeShipsTest();
  turn = 'player';
};

const placeShipsRandomly = () => {
  resetPlayerObjs();
  player.placeShipsRandomly();
  DOM.renderPreGame(player);
};

const playAgain = () => {
  resetPlayerObjs();
  startPreGame();
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
  enemy.placeShipsRandomly();
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
  else if (attackResults === 'miss') {
    DOM.renderEnemysTurn();
    initiateEnemyAttack();
  }
};

// recursively attack at random until a miss or victory occurs
const initiateEnemyAttack = (attackResults) => {
  setTimeout(() => {
    turn = 'enemy';

    if (attackResults === 'miss') {
      turn = 'player';
      DOM.renderPlayersTurn();
      return;
    }

    if (attackResults === 'game over') {
      declareVictor('Computer');
      return;
    }
    DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
    setTimeout(() => {
      initiateEnemyAttack(enemy.smartAttack(player.boardObj()));
      DOM.renderGameboardChanges(enemy.boardArr(), player.boardArr());
    }, 1500);
  }, 750);
};

const declareVictor = (victorName) => {
  DOM.renderGameWinner(victorName);
};

const getTurn = () => {
  return turn;
};

export {
  start,
  startPreGame,
  playAgain,
  startGamePlay,
  playerAttack,
  placeShipsRandomly,
  getTurn,
};
