import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const playedCoordinates = [];
  const gameboard = Gameboard();

  const attack = (coordinates, enemyBoard) => {
    playedCoordinates.push(coordinates);
    const isHit = enemyBoard.receiveAttack(coordinates);
    return isHit ? true : false;
  };

  const boardObj = () => {
    return gameboard;
  };

  const boardArr = () => {
    return gameboard.getArray();
  };

  const hasBeenPlayed = (coordinates) => {
    const [row, col] = coordinates;
    const filtered = playedCoordinates.filter((coord) => {
      const [oldRow, oldCol] = coord;
      if (oldRow === row && oldCol === col) return true;
    });
    return filtered.length === 0 ? false : true;
  };

  return {
    attack,
    boardArr,
    boardObj,
    hasBeenPlayed,
    playedCoordinates,
  };
}

// Computer (Player) Factory

export function Computer() {
  const proto = Player();

  const randomAttack = (enemyBoard) => {
    const boardArr = enemyBoard.getArray();
    const boardSize = boardArr.length;
    let randomCoordinates;

    while (!randomCoordinates || proto.hasBeenPlayed(randomCoordinates))
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
