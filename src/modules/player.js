import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const prevPlayedCoordinates = [];
  const gameboard = Gameboard();

  const attack = (coordinates, enemyBoard) => {
    prevPlayedCoordinates.push(coordinates);
    const isHit = enemyBoard.receiveAttack(coordinates);
    return isHit ? true : false;
  };

  const boardObj = () => {
    return gameboard;
  };

  const boardArr = () => {
    return gameboard.getArray();
  };

  // check if a coordinate has been played already
  // array.includes() doesn't work with nested arrays
  const isRepeatPlay = (coordinates) => {
    const [row, col] = coordinates;
    const duplicateCoordinates = prevPlayedCoordinates.filter((coord) => {
      const [oldRow, oldCol] = coord;
      if (oldRow === row && oldCol === col) return true;
    });
    return duplicateCoordinates.length === 0 ? false : true;
  };

  return {
    attack,
    boardArr,
    boardObj,
    isRepeatPlay,
    prevPlayedCoordinates,
  };
}

// Computer Factory (inherits from Player factory)

export function Computer() {
  const proto = Player();

  // randomly attack a positon on the enemy's board
  const randomAttack = (enemyBoard) => {
    const boardArr = enemyBoard.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates;

    // prevent computer from making duplicate attacks
    while (!randomCoordinates || proto.isRepeatPlay(randomCoordinates))
      randomCoordinates = generateRandomCoordinates(boardSize);

    // attack() returns true if hit, false if not
    return proto.attack(randomCoordinates, enemyBoard);
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
