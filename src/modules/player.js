import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const playedCoordinates = [];
  const gameboard = Gameboard();

  const attack = (coordinate, enemyBoard) => {
    if (!playedCoordinates.includes(coordinate)) {
      enemyBoard.receiveAttack(coordinate);
      playedCoordinates.push(coordinate);
    }
  };

  const boardObj = () => {
    return gameboard;
  };

  return {
    attack,
    boardObj,
    playedCoordinates,
  };
}

// Computer (Player) Factory

export function Computer() {
  const proto = Player();

  const randomAttack = (enemyBoard) => {
    const boardArr = enemyBoard.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates = null;

    while (
      randomCoordinates === null ||
      !proto.playedCoordinates.includes(randomCoordinates)
    )
      randomCoordinates = getRandomCoordinates(boardSize);

    proto.attack(randomCoordinates, enemyBoard);
  };

  const getRandomCoordinates = (boardSize) => {
    const randomRow = randomInt(0, boardSize - 1);
    const randomCol = randomInt(0, boardSize - 1);
    return [randomRow, randomCol];
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return { ...proto, randomAttack };
}
