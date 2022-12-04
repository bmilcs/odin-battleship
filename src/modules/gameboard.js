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

  // returns true if ship can be placed between two coordinates
  const canPlaceShipBetween = (startPos, endPos) => {
    const allCoordinates = getAllCoordinatesBetween(startPos, endPos);
    return allCoordinates.every((coord) => areEmptyValidCoordinates(coord));
  };

  // calculate end coordinate, given a starting position, direction & ship size
  const getEndCoordinate = (startPos, direction, shipSize) => {
    const [startRow, startCol] = startPos;
    let endRow = startRow;
    let endCol = startCol;

    if (direction === 'vertical') {
      endCol = startCol;
      endRow += shipSize - 1;
    } else {
      endRow = startRow;
      endCol += shipSize - 1;
    }

    return [endRow, endCol];
  };

  const areEmptyValidCoordinates = (coordinates) => {
    if (!areCoordinatesInsideBoard(coordinates)) return false;
    if (!areCoordinatesEmpty(coordinates)) return false;
    return true;
  };

  const areUnplayedValidCoordinates = (coordinates) => {
    if (!areCoordinatesInsideBoard(coordinates)) return false;
    if (!areCoordinatesUnplayed(coordinates)) return false;
    return true;
  };

  const areCoordinatesEmpty = (coordinates) => {
    const [row, col] = coordinates;
    return boardArr[row][col] === '' ? true : false;
  };

  const areCoordinatesInsideBoard = (coordinates) => {
    const [row, col] = coordinates;
    return row >= boardSize || row < 0 || col >= boardSize || col < 0
      ? false
      : true;
  };

  const areCoordinatesAMiss = (coordinates) => {
    const [row, col] = coordinates;
    return boardArr[row][col] === 'M' ? true : false;
  };

  const areCoordinatesUnplayed = (coordinates) => {
    const [row, col] = coordinates;
    return boardArr[row][col] === '' || typeof boardArr[row][col] === 'number'
      ? true
      : false;
  };

  // receive attack: if ship is hit, send .hit() to the corresponding ship obj
  // if miss, record attack
  const receiveAttack = (coordinates) => {
    const [row, col] = coordinates;
    const currentValueOnBoard = boardArr[row][col];

    // pure number = untouched ship ID
    if (typeof currentValueOnBoard === 'number') {
      const shipID = currentValueOnBoard;
      const shipObj = shipsArr[shipID];
      shipObj.hit();
      shipObj.isSunk()
        ? sinkShipInGameboardArray(shipID)
        : (boardArr[row][col] += 'X');

      if (areAllShipsSunk()) return 'game over';

      return shipObj.isSunk() ? 'sunk' : 'hit';
    } else {
      boardArr[row][col] = 'M';
      return 'miss';
    }
  };

  // when a final blow is landed on a ship, causing it to sink,
  // update all references to that ship to "#S" in the gameboard array
  // where # = ship.id and "S" = sunk
  const sinkShipInGameboardArray = (shipID) => {
    boardArr.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (boardArr[r][c].toString().includes(shipID))
          boardArr[r][c] = `${shipID}S`;
      });
    });
  };

  const areAllShipsSunk = () => shipsArr.every((ship) => ship.isSunk());

  //
  // utility functions
  //

  // get valid moves along the axis of 2 successful hits
  const getLinearNextMoves = (startPos, endPos) => {
    const linearNextMoves = [];
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;
    let coord;

    if (endRow === startRow) {
      let currentCol = startCol;
      while (true) {
        coord = [startRow, currentCol++];
        if (!areCoordinatesInsideBoard(coord)) break;
        if (areCoordinatesAMiss(coord)) break;
        if (areCoordinatesUnplayed(coord)) {
          linearNextMoves.push(coord);
          break;
        }
      }
      currentCol = startCol;
      while (true) {
        coord = [startRow, currentCol--];
        if (!areCoordinatesInsideBoard(coord)) break;
        if (areCoordinatesAMiss(coord)) break;
        if (areCoordinatesUnplayed(coord)) {
          linearNextMoves.push(coord);
          break;
        }
      }
    } else {
      let currentRow = startRow;
      while (true) {
        coord = [currentRow++, startCol];
        if (!areCoordinatesInsideBoard(coord)) break;
        if (areCoordinatesAMiss(coord)) break;
        if (areCoordinatesUnplayed(coord)) {
          linearNextMoves.push(coord);
          break;
        }
      }
      currentRow = startRow;
      while (true) {
        coord = [currentRow--, startCol];
        if (!areCoordinatesInsideBoard(coord)) break;
        if (areCoordinatesAMiss(coord)) break;
        if (areCoordinatesUnplayed(coord)) {
          linearNextMoves.push(coord);
          break;
        }
      }
    }

    return linearNextMoves;
  };

  const getAllAdjectNextMoves = (coordinates, enemyBoardObj) => {
    const [row, col] = coordinates;

    const allPossibleMoves = [];
    allPossibleMoves.push([row + 1, col]);
    allPossibleMoves.push([row - 1, col]);
    allPossibleMoves.push([row, col + 1]);
    allPossibleMoves.push([row, col - 1]);

    const validNextMoves = allPossibleMoves.filter((coordinates) =>
      enemyBoardObj.areUnplayedValidCoordinates(coordinates)
    );

    return validNextMoves;
  };

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

  const getArray = () => {
    return boardArr;
  };

  return {
    getArray,
    getAllCoordinatesBetween,
    getEndCoordinate,
    getAllAdjectNextMoves,
    getLinearNextMoves,
    areCoordinatesEmpty,
    areCoordinatesInsideBoard,
    areEmptyValidCoordinates,
    areUnplayedValidCoordinates,
    canPlaceShipBetween,
    placeShip,
    receiveAttack,
    areAllShipsSunk,
  };
};
