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
  DOM.renderPlayersTurn();
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
    }, 500);
  }, 1000);
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
  resetPlayerObjs,
  playAgain,
  startGamePlay,
  playerAttack,
  placeShipsRandomly,
  getTurn,
};
