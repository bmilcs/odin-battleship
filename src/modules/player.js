import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const prevPlayedCoordinates = [];
  const gameboardObj = Gameboard();
  let placeShipCounter = 5;

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
    placeShipCounter,
  };
}

// Computer Factory (inherits from Player factory)

export function Computer() {
  const proto = Player();

  // randomly attack a positon on the enemy's board
  const randomAttack = (enemyBoardObj) => {
    const boardArr = enemyBoardObj.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates;

    // prevent computer from making duplicate attacks
    while (!randomCoordinates || proto.isRepeatPlay(randomCoordinates))
      randomCoordinates = generateRandomCoordinates(boardSize);

    // attack(): returns 'hit', 'miss', 'game over' (app.js gameflow)
    return proto.attack(randomCoordinates, enemyBoardObj);
  };

  const generateRandomCoordinates = (boardSize) => {
    const randomRow = randomInt(0, boardSize - 1);
    const randomCol = randomInt(0, boardSize - 1);
    return [randomRow, randomCol];
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return { ...proto, randomAttack };
}
