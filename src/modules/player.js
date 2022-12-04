import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const prevPlayedCoordinates = [];
  const gameboardObj = Gameboard();
  const placeShipList = [2, 3, 3, 4, 5];

  const attack = (coordinates, enemyBoardObj) => {
    // prevent repeat attacks on the same position
    const repeatPlay = isRepeatPlay(coordinates);
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

  // check if a set of coordinates has been played already
  // * note: array.includes() doesn't work with nested arrays
  const isRepeatPlay = (coordinates) => {
    const [targetRow, targetCol] = coordinates;
    const duplicateCoordinates = prevPlayedCoordinates.filter((coord) => {
      const [prevPlayedRow, prevPlayedCol] = coord;
      if (prevPlayedRow === targetRow && prevPlayedCol === targetCol)
        return true;
    });
    return duplicateCoordinates.length === 0 ? false : true;
  };

  return {
    attack,
    boardArr,
    boardObj,
    isRepeatPlay,
    placeShipList,
  };
}

// Computer Factory (inherits from Player factory)

export function Computer() {
  const proto = Player();

  // recursively place enemy ships on gameboard using a stack
  const placeShipsRandomly = () => {
    const shipSize = proto.placeShipList.pop();
    if (shipSize === undefined) return;

    const boardObj = proto.boardObj();
    const boardSize = proto.boardArr().length;
    let startPos, endPos, shipDirection, canPlaceShipHere;

    while (!canPlaceShipHere) {
      startPos = generateRandomCoordinates(boardSize);
      shipDirection = randomInt(0, 1) === 0 ? 'vertical' : 'horizontal';
      endPos = boardObj.getEndCoordinate(startPos, shipDirection, shipSize);
      canPlaceShipHere = boardObj.canPlaceShipBetween(startPos, endPos);
    }

    boardObj.placeShip(startPos, endPos);
    placeShipsRandomly();
  };

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
    while (!randomCoordinates || proto.isRepeatPlay(randomCoordinates))
      randomCoordinates = generateRandomCoordinates(boardSize);

    // attack(): returns 'hit', 'miss', 'game over' (app.js gameflow)
    const attackResults = proto.attack(randomCoordinates, enemyBoardObj);
    smartAttackResultsHandler(attackResults, randomCoordinates);

    return attackResults;
  };

  const smartAttackResultsHandler = (attackResults, coordinates) => {
    if (attackResults === 'hit') successfulAttacks.push(coordinates);
    if (attackResults === 'sunk') {
      console.log('SUNK SHIP! Clearing stacks');
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
    if (successfulAttacks.length === 0 && adjacentNextMoveStack.length === 0) {
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
      const nextMoves = enemyBoardObj.getAllAdjectNextMoves(
        lastHit,
        enemyBoardObj
      );
      nextMoves.forEach((move) => adjacentNextMoveStack.push(move));
    }

    // 2+ successful hits have landed & ship is not sunk yet
    // get next valid linear moves
    if (successfulAttacks.length > 1) {
      clearAdjacentNextMovesStack();
      console.log('successful hits', successfulAttacks);
      // add both direction nextvalid coord
      const startPos = successfulAttacks[0];
      const endPos = successfulAttacks[1];
      console.log('hit 1', startPos, 'hit 2', endPos);

      const linearMoves = enemyBoardObj.getLinearNextMoves(startPos, endPos);
      linearMoves.forEach((move) => linearNextMovesStack.push(move));
      console.log('next move stack:', linearNextMovesStack);
    }

    let coordinates;

    adjacentNextMoveStack.length > 0
      ? (coordinates = adjacentNextMoveStack.pop())
      : (coordinates = linearNextMovesStack.pop());
    console.log('testing', coordinates);

    const attackResults = proto.attack(coordinates, enemyBoardObj);
    smartAttackResultsHandler(attackResults, coordinates);
    return attackResults;
  };

  const generateRandomCoordinates = (boardSize) => {
    const randomRow = randomInt(0, boardSize - 1);
    const randomCol = randomInt(0, boardSize - 1);
    return [randomRow, randomCol];
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return { ...proto, randomAttack, smartAttack, placeShipsRandomly };
}
