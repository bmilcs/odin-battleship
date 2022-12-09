import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const prevPlayedCoordinates = [];
  const gameboardObj = Gameboard();
  const placeShipList = [2, 3, 3, 4, 5];

  const attack = (coordinates, enemyBoardObj) => {
    // prevent repeat attacks on the same position
    const repeatPlay = isRepeatPlay(coordinates, enemyBoardObj);
    if (repeatPlay) return 'repeat';

    prevPlayedCoordinates.push(coordinates);

    // receiveAttack returns hit, miss or game over,
    // which is controlled by app.js
    return enemyBoardObj.receiveAttack(coordinates);
  };

  const boardObj = () => {
    return gameboardObj;
  };

  const boardArr = () => {
    return gameboardObj.getArray();
  };

  const generateRandomCoordinates = (boardSize) => {
    const randomRow = randomInt(0, boardSize - 1);
    const randomCol = randomInt(0, boardSize - 1);
    return [randomRow, randomCol];
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // recursively place enemy ships on gameboard using a stack
  const placeShipsRandomly = () => {
    const shipSize = placeShipList.pop();
    if (shipSize === undefined) return;

    // const boardObj = boardObj();
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

  // check if a set of coordinates has been played already
  const isRepeatPlay = (coordinates, enemyBoardObj) => {
    const [row, col] = coordinates;
    const boardArr = enemyBoardObj.getArray();
    const valueOnBoard = boardArr[row][col];
    if (typeof valueOnBoard === 'number') return false;
    if (valueOnBoard === '') return false;
    return true;
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

// Computer Factory (inherits from Player factory)

export function Computer() {
  const proto = Player();

  //
  // attacking functions
  //

  const successfulAttacks = [];
  const adjacentNextMoveStack = [];
  const linearNextMovesStack = [];

  // randomly attack a positon on the enemy's board
  const randomAttack = (enemyBoardObj) => {
    const boardArr = enemyBoardObj.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates;

    // prevent computer from making duplicate attacks
    while (true) {
      randomCoordinates = proto.generateRandomCoordinates(boardSize);
      if (proto.isRepeatPlay(randomCoordinates, enemyBoardObj)) continue;
      // ignore squares with no adjacent openings (can't possibly be a ship)
      const adjacentMoves = enemyBoardObj.getAllValidAdjacentCoordinates(
        randomCoordinates,
        enemyBoardObj
      );
      if (adjacentMoves.length > 0) break;
    }

    // attack(): returns 'hit', 'miss', 'game over' (app.js gameflow)
    const attackResults = proto.attack(randomCoordinates, enemyBoardObj);
    smartAttackResultsHandler(attackResults, randomCoordinates);

    return attackResults;
  };

  const smartAttackResultsHandler = (attackResults, coordinates) => {
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

  // smart attack
  const smartAttack = (enemyBoardObj) => {
    // no hits recently
    if (
      successfulAttacks.length === 0 &&
      adjacentNextMoveStack.length === 0 &&
      linearNextMovesStack.length === 0
    ) {
      return randomAttack(enemyBoardObj);
    }

    // last move = hit, but no smart moves have been added to stack
    // add all valid adjacent moves
    if (
      adjacentNextMoveStack.length === 0 &&
      linearNextMovesStack.length === 0 &&
      successfulAttacks.length === 1
    ) {
      const lastHit = successfulAttacks[successfulAttacks.length - 1];
      const nextMoves = enemyBoardObj.getAllValidAdjacentCoordinates(
        lastHit,
        enemyBoardObj
      );
      nextMoves.forEach((move) => adjacentNextMoveStack.push(move));
    }

    // 2+ successful hits have landed & ship is not sunk yet
    // get next valid linear moves
    if (successfulAttacks.length > 1) {
      clearAdjacentNextMovesStack();
      const startPos = successfulAttacks[0];
      const endPos = successfulAttacks[1];

      const linearMoves = enemyBoardObj.getLinearNextMoves(startPos, endPos);
      linearMoves.forEach((move) => linearNextMovesStack.push(move));
    }

    let coordinates;

    adjacentNextMoveStack.length > 0
      ? (coordinates = adjacentNextMoveStack.pop())
      : (coordinates = linearNextMovesStack.pop());

    const attackResults = proto.attack(coordinates, enemyBoardObj);
    smartAttackResultsHandler(attackResults, coordinates);
    return attackResults;
  };

  return { ...proto, randomAttack, smartAttack };
}
