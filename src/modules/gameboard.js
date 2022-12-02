import Ship from './ship';

// Gameboard Factory

export default (boardSize = 10) => {
  // create gameboard array: boardSize x boardSize dimensions
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

  // storage:
  const boardArr = create(boardSize);
  const shipsArr = [];

  // place a ship on gameboard array, between start & end positions
  const placeShip = (startPos, endPos) => {
    // get all cordinates between start & end position (row/column)
    const allCoordinates = getAllCoordinatesBetween(startPos, endPos);

    // create ship: size is determined by how many coordinates it contains
    const shipLength = allCoordinates.length;
    const shipObj = Ship(shipLength);

    // id & store ship in shipsArr
    shipObj.id = shipsArr.length;
    shipsArr.push(shipObj);

    // add ship's id to allCoordinates within the gameboard array:
    allCoordinates.forEach((coordinate) => {
      const [row, col] = coordinate;
      boardArr[row][col] = shipObj.id;
    });
  };

  // receive attack: if ship is hit, send .hit() to the corresponding ship obj
  // if miss, record attack
  const receiveAttack = (coordinates) => {
    const [row, col] = coordinates;
    const currentValueOnBoard = boardArr[row][col];

    // number = id of a ship object
    if (typeof currentValueOnBoard === 'number') {
      const shipID = currentValueOnBoard;
      const shipObj = shipsArr[shipID];
      shipObj.hit();
      shipObj.isSunk()
        ? sinkShipInGameboardArray(shipID)
        : (boardArr[row][col] += 'X');
      return true;
    } else {
      boardArr[row][col] = 'M';
      return false;
    }
  };

  const sinkShipInGameboardArray = (shipID) => {
    boardArr.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (boardArr[r][c].toString().includes(shipID))
          boardArr[r][c] = `${shipID}S`;
      });
    });
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
    let allCoordinates = [];
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;

    // determine if coordinates span vertically or horizontally
    const rowDiff = Math.abs(startRow - endRow);

    // if ship is placed vertically, get all row #'s between start/end pos
    if (rowDiff > 0) {
      const rowNumbers = getAllNumbersBetween(startRow, endRow);
      allCoordinates = rowNumbers.map((row) => {
        return [row, startCol];
      });
    } else {
      // ship is place horizontally: get all col #'s between start/end pos
      const colNumbers = getAllNumbersBetween(startCol, endCol);
      allCoordinates = colNumbers.map((col) => {
        return [startRow, col];
      });
    }

    return allCoordinates;
  };

  // returns all integers between 2 integers
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
