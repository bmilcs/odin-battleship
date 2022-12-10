import * as DOM from './dom';
import * as Player from './player';

// entry point for index.js
const startApp = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
  resetPlayerObjs();
};

let playerObj;
let enemyObj;
let turn;

const resetPlayerObjs = () => {
  playerObj = Player.Player();
  enemyObj = Player.Computer();
  enemyObj.placeShipsRandomly();
};

// triggered by main menu's start game button
const startPreGame = () => {
  DOM.renderPreGame(playerObj);
};

// trigged by clicking 'auto' button in pregame
const placePlayerShipsAutomatically = () => {
  resetPlayerObjs();
  playerObj.placeShipsRandomly();
  DOM.renderPreGame(playerObj);
};

// triggered when 'play again' button is pressed after a game ends
const playAgain = () => {
  resetPlayerObjs();
  startPreGame();
};

// triggered after player places all ships & clicks start game button
const startGamePlay = () => {
  DOM.renderGameModeLayout();
  DOM.renderGameboardChanges(enemyObj.boardArr(), playerObj.boardArr());
  DOM.renderPlayersTurn();
};

//
// Game Play Mode
//

// triggered by player clicking on gameboard during gameplay
const playerAttack = (coordinates) => {
  // capture result of a player's attack
  const attackResults = playerObj.attack(coordinates, enemyObj.boardObj());

  // update screen w/ results of the attack
  DOM.renderGameboardChanges(enemyObj.boardArr(), playerObj.boardArr());

  if (attackResults === 'game over') declareVictor('Player');
  else if (attackResults === 'miss') {
    turn = 'enemy';
    DOM.renderEnemysTurn();
    initiateEnemyAttack();
  }
};

// recursively attack at random until a miss or victory occurs
const initiateEnemyAttack = (attackResults) => {
  setTimeout(() => {
    // base case: missed attack
    if (attackResults === 'miss') {
      turn = 'player';
      DOM.renderPlayersTurn();
      return;
    }

    // base case: computer wins games
    if (attackResults === 'game over') {
      declareVictor('Computer');
      return;
    }

    // update screen w/ both gameboards
    DOM.renderGameboardChanges(enemyObj.boardArr(), playerObj.boardArr());

    // recursively call smartAttack() method & update DOM
    setTimeout(() => {
      initiateEnemyAttack(enemyObj.smartAttack(playerObj.boardObj()));
      DOM.renderGameboardChanges(enemyObj.boardArr(), playerObj.boardArr());
    }, 400);
  }, 1200);
};

const declareVictor = (victorName) => {
  DOM.renderGameWinner(victorName);
};

const getTurn = () => {
  return turn;
};

export {
  startApp,
  resetPlayerObjs,
  startPreGame,
  startGamePlay,
  placePlayerShipsAutomatically,
  playerAttack,
  getTurn,
  playAgain,
};
