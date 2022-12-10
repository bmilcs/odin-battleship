import Gameboard from './gameboard';

//
// player factory: used by player & computer objects
//

export function Player() {
  const gameboardObj = Gameboard();
  const placeShipList = [2, 3, 3, 4, 5];

  const boardObj = () => {
    return gameboardObj;
  };

  const boardArr = () => {
    return gameboardObj.getArray();
  };

  const attack = (coordinates, enemyBoardObj) => {
    // prevent repeat attacks on the same position
    const repeatPlay = isRepeatPlay(coordinates, enemyBoardObj);
    if (repeatPlay) return 'repeat';

    // receiveAttack returns hit, sunk, miss or game over,
    // which is controlled by app.js
    return enemyBoardObj.receiveAttack(coordinates);
  };

  // check if a set of coordinates has been played already
  const isRepeatPlay = (coordinates, enemyBoardObj) => {
    const [row, col] = coordinates;
    const boardArr = enemyBoardObj.getArray();
    const valueOnBoard = boardArr[row][col];
    if (typeof valueOnBoard === 'number') return false;
    if (valueOnBoard === '') return false;
    return true;
  };

  // recursively place ships on a gameboard using a stack
  const placeShipsRandomly = () => {
    const shipSize = placeShipList.pop();
    if (shipSize === undefined) return;

    const boardSize = gameboardObj.getArray().length;
    let startPos, endPos, shipDirection, canPlaceShipHere;

    while (!canPlaceShipHere) {
      startPos = generateRandomCoordinates(boardSize);
      shipDirection = randomInt(0, 1) === 0 ? 'vertical' : 'horizontal';
      endPos = gameboardObj.getEndCoordinate(startPos, shipDirection, shipSize);
      canPlaceShipHere = gameboardObj.canPlaceShipBetween(startPos, endPos);
    }

    gameboardObj.placeShip(startPos, endPos);
    placeShipsRandomly();
  };

  const generateRandomCoordinates = (boardSize) => {
    const randomRow = randomInt(0, boardSize - 1);
    const randomCol = randomInt(0, boardSize - 1);
    return [randomRow, randomCol];
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    attack,
    boardArr,
    boardObj,
    placeShipsRandomly,
    isRepeatPlay,
    generateRandomCoordinates,
    placeShipList,
  };
}

//
// computer factory: inherits from Player factory
//

export function Computer() {
  const proto = Player();

  // arrays used by computer to make intelligent decisions once a random attack
  // results in a hit
  const successfulAttacks = [];
  const adjacentNextMoveStack = [];
  const linearNextMovesStack = [];

  const smartAttack = (enemyBoardObj) => {
    // if no intelligent next moves exist, attack at random
    if (
      successfulAttacks.length === 0 &&
      adjacentNextMoveStack.length === 0 &&
      linearNextMovesStack.length === 0
    ) {
      return randomAttack(enemyBoardObj);
    }

    // if the last move resulted in a hit but no linear/adjacent moves are present
    // add all valid adjacent moves: we want to attack in a cross like formation
    if (
      adjacentNextMoveStack.length === 0 &&
      linearNextMovesStack.length === 0 &&
      successfulAttacks.length === 1
    ) {
      const lastHit = successfulAttacks[0];
      const nextMoves = enemyBoardObj.getAllValidAdjacentCoordinates(
        lastHit,
        enemyBoardObj
      );
      nextMoves.forEach((move) => adjacentNextMoveStack.push(move));
    }

    // if 2+ hits have landed on a ship but it isn't sunk yet
    if (successfulAttacks.length > 1) {
      // we don't want to attack in a cross formation anymore:
      clearAdjacentNextMovesStack();

      // add linear next moves to its own stack
      const startPos = successfulAttacks[0];
      const endPos = successfulAttacks[successfulAttacks.length - 1];
      const linearMoves = enemyBoardObj.getLinearNextMoves(startPos, endPos);
      linearMoves.forEach((move) => linearNextMovesStack.push(move));
    }

    let coordinatesToAttack;

    // if adjacent moves exist, attack those. otherwise, attack linearly.
    adjacentNextMoveStack.length > 0
      ? (coordinatesToAttack = adjacentNextMoveStack.pop())
      : (coordinatesToAttack = linearNextMovesStack.pop());

    const attackResults = proto.attack(coordinatesToAttack, enemyBoardObj);
    handleAttackResultsIntelligently(attackResults, coordinatesToAttack);

    return attackResults;
  };

  const handleAttackResultsIntelligently = (attackResults, coordinates) => {
    if (attackResults === 'hit') successfulAttacks.push(coordinates);
    if (attackResults === 'sunk') {
      clearAdjacentNextMovesStack();
      clearLastSuccessfulAttack();
      clearLinearNextMovesStack();
    }
  };

  const clearLinearNextMovesStack = () => {
    clearArrayValues(linearNextMovesStack);
  };

  const clearAdjacentNextMovesStack = () => {
    clearArrayValues(adjacentNextMoveStack);
  };

  const clearLastSuccessfulAttack = () => {
    clearArrayValues(successfulAttacks);
  };

  const clearArrayValues = (array) => {
    while (array.length > 0) array.pop();
  };

  // when no logical next moves exist, attack at random
  const randomAttack = (enemyBoardObj) => {
    const boardArr = enemyBoardObj.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates;

    // loop until the random set of coordinates meets the requrements:
    while (true) {
      // 1) are not a repeat a attack
      randomCoordinates = proto.generateRandomCoordinates(boardSize);
      if (proto.isRepeatPlay(randomCoordinates, enemyBoardObj)) continue;

      // 2) have at least 1 adjacent unplayed coordinate. why?
      // it can't possibly contain a ship during a random attack
      const adjacentMoves = enemyBoardObj.getAllValidAdjacentCoordinates(
        randomCoordinates,
        enemyBoardObj
      );

      if (adjacentMoves.length > 0) break;
    }

    const attackResults = proto.attack(randomCoordinates, enemyBoardObj);
    handleAttackResultsIntelligently(attackResults, randomCoordinates);

    // attack(): returns 'hit', 'sunk', 'miss', 'game over' (handled by app.js gameflow)
    return attackResults;
  };

  return { ...proto, randomAttack, smartAttack };
}
