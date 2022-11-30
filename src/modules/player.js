import Gameboard from './gameboard';

// Player Factory

export function Player() {
  const playedCoordinates = [];
  const gameboard = Gameboard();

  const attack = (coordinates, enemyBoard) => {
    // const coordinatesHaveBeenPlayed = playedCoordinates.includes(coordinates);
    // if (coordinatesHaveBeenPlayed) return;
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

  return {
    attack,
    boardArr,
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
      hasBeenPlayed(randomCoordinates, proto.playedCoordinates)
    )
      randomCoordinates = getRandomCoordinates(boardSize);

    proto.attack(randomCoordinates, enemyBoard);
  };

  const hasBeenPlayed = (coordinates, array) => {
    const [row, col] = coordinates;
    const filtered = array.filter((coord) => {
      const [oldRow, oldCol] = coord;
      if (oldRow === row && oldCol === col) return true;
    });

    return filtered.length === 0 ? false : true;
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
