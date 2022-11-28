import * as DOM from './dom';
import * as Player from './player';
import * as Gameboard from './gameboard';
import * as Ship from './ship';

let player;
let computer;

const start = () => {
  DOM.renderLayout();
  DOM.renderMainMenu();
  startNewGame();
};

const startNewGame = () => {
  DOM.clearMain();
  resetPlayers();
  DOM.renderBoard(player.boardArr());
  // allow user to place ships
  // place computer ships
  // start
};

const resetPlayers = () => {
  player = Player.Player();
  computer = Player.Computer();
};

export { start, startNewGame };
