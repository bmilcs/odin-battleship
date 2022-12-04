import * as DOM from './dom';
import * as Player from './player';

const start = () => {
  DOM.renderLayout();
  // DOM.renderMainMenu();
  startPreGame();
};

let player;
let enemy;

const startPreGame = () => {
  resetPlayerObjs();
  DOM.renderPreGame(player);
  enemy.placeShipsRandomly();
};

const resetPlayerObjs = () => {
  player = Player.Player();
  enemy = Player.Computer();
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
