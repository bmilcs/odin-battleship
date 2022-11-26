import Ship from './ship';

//
// Gameboard Factory
//

export default (boardSize = 10) => {
  // create gameboard of defaultSize x defaultSize
  const create = (boardSize) => {
    let board = [];
    for (let row = 0; row < boardSize; row++) {
      board[row] = [];
      for (let col = 0; col < boardSize; col++) {
        board[row][col] = '';
      }
    }
    return board;
  };

  // storage

  const boardArr = create(boardSize);
  const shipsArr = [];

  // place ships at coordinates by calling Ship factory function

  const placeShip = (startPos, endPos) => {
    const allCoordinates = getAllCoordinatesBetween(startPos, endPos);
    // create ship
    const shipLength = allCoordinates.length;
    const newShip = Ship(shipLength);
    // id & store ship in shipsArr
    newShip.id = shipsArr.length;
    shipsArr.push(newShip);

    // update gameboard w/ ship's id
    allCoordinates.forEach((coordinate) => {
      const [row, col] = coordinate;
      boardArr[row][col] = newShip.id;
    });
  };

  // receive attack: if ship is hit, send .hit()
  // if miss, record attack

  const receiveAttack = (coordinates) => {
    const [row, col] = coordinates;
    const currentValueOnBoard = boardArr[row][col];

    // number = id of a ship object
    if (typeof currentValueOnBoard === 'number') {
      const shipID = currentValueOnBoard;
      const ship = shipsArr[shipID];
      ship.hit();
      boardArr[row][col] = 'X';
    } else {
      boardArr[row][col] = 'M';
    }
  };

  const areAllShipsSunk = () => shipsArr.every((ship) => ship.isSunk());

  // get array of miss coordinates
  const getAllMisses = () => {
    const missCoordinatesArr = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (boardArr[row][col] === 'M') missCoordinatesArr.push([row, col]);
      }
    }
    return missCoordinatesArr;
  };

  //
  // utility functions
  //

  const getAllCoordinatesBetween = (startPos, endPos) => {
    let positionsArr = [];
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;

    const rowDiff = Math.abs(startRow - endRow);

    // if ship is placed up/down, get all row #'s between start/end pos
    if (rowDiff > 0) {
      const rowNumbers = getAllNumbersBetween(startRow, endRow);
      positionsArr = rowNumbers.map((row) => {
        return [row, startCol];
      });
    } else {
      // get all col #'s between start/end pos
      const colNumbers = getAllNumbersBetween(startCol, endCol);
      positionsArr = colNumbers.map((col) => {
        return [startRow, col];
      });
    }

    return positionsArr;
  };

  // returns all integers between 2 or more integers
  const getAllNumbersBetween = (x, y) => {
    const numbers = [];
    let high, low;

    if (x > y) {
      high = x;
      low = y;
    } else {
      high = y;
      low = x;
    }

    for (let i = low; i <= high; i++) numbers.push(i);
    return numbers;
  };

  const positionsWithinBoard = (startPos, endPos) => {
    // make sure start & end coordinates fall within the bounds of the board
  };

  const positionsAreEmpty = (startPos, endPos) => {
    // make sure start & end coordinates are empty
  };

  // print contents of gameboard to array
  const print = () => {
    console.log(boardArr);
    boardArr.forEach((row, i) => {
      console.log(`${i} ${row}`);
    });
  };

  const getArray = () => {
    return boardArr;
  };

  return {
    getArray,
    getAllCoordinatesBetween,
    placeShip,
    receiveAttack,
    areAllShipsSunk,
    getAllMisses,
  };
};
