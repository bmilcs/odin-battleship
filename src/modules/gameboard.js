import Ship from './ship';

//
// Gameboard Factory
//

export default (boardSize = 10) => {
  // on instantiation, a gameboard array is created & stored in boardArr
  const createGameboardArr = (boardSize) => {
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
  const boardArr = createGameboardArr(boardSize);
  const shipsArr = [];

  // place a ship on gameboard array, between start & end positions
  const placeShip = (startPos, endPos) => {
    // get all cordinates between start & end position (row/column)
    const allCoordinates = getAllCoordinatesBetween(startPos, endPos);

    // create ship: size is determined by how many coordinates it consists of
    const shipLength = allCoordinates.length;
    const shipObj = Ship(shipLength);

    // id & store ship in shipsArr
    shipObj.id = shipsArr.length;
    shipsArr.push(shipObj);

    // add ship's id to allCoordinates within the gameboard array
    allCoordinates.forEach((coordinate) => {
      const [row, col] = coordinate;
      boardArr[row][col] = shipObj.id;
    });
  };

  // returns true if ship can be placed between two coordinates
  const canPlaceShipBetween = (startPos, endPos) => {
    const allCoordinates = getAllCoordinatesBetween(startPos, endPos);

    return allCoordinates.every((coord) => {
      // get coordinates above, below, to the left & right of a given coordinate
      const adjacentCoordinates = getAllValidAdjacentCoordinates(coord);
      const isTouchingTheSideOfAnotherShip = adjacentCoordinates.some(
        (adjCoord) => !areCoordinatesEmpty(adjCoord)
      );

      // get coordinates that form the corners of a ship outline
      // these appear when a ship is sunk, forming a border around it
      const cornerCoordinates = getCornerCoordinates(coord);
      const isTouchingTheCornerOfAnotherShip = cornerCoordinates.some(
        (diagCoord) => !areCoordinatesEmpty(diagCoord)
      );

      // all coordinates must pass the following conditions:
      if (
        !isTouchingTheSideOfAnotherShip &&
        !isTouchingTheCornerOfAnotherShip &&
        areCoordinatesInsideBoard(coord) &&
        areCoordinatesEmpty(coord)
      )
        return true;
    });
  };

  // calculate end coordinate for a ship, given a starting position, direction & ship size
  const getEndCoordinate = (startPos, direction, shipSize) => {
    const [startRow, startCol] = startPos;
    let endRow = startRow;
    let endCol = startCol;

    direction === 'vertical'
      ? (endRow += shipSize - 1)
      : (endCol += shipSize - 1);

    return [endRow, endCol];
  };

  const areCoordinatesUnplayedInsideBoard = (coordinates) => {
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
    const coordinatesContainAShip = typeof currentValueOnBoard === 'number';

    if (coordinatesContainAShip) {
      const shipID = currentValueOnBoard;
      const shipObj = shipsArr[shipID];
      shipObj.hit();

      if (shipObj.isSunk()) {
        sinkShipInGameboardArray(shipID);
        sinkOutlineAroundSunkShips();
      } else {
        // add 'X' to current value, representing a hit
        // ie: "3X", ship.id = 3, "X" = hit
        boardArr[row][col] += 'X';
      }

      if (areAllShipsSunk()) return 'game over';
      if (shipObj.isSunk()) return 'sunk';
      return 'hit';
    } else {
      // coordinates do not contain a ship
      boardArr[row][col] = 'M';
      return 'miss';
    }
  };

  const areAllShipsSunk = () => shipsArr.every((ship) => ship.isSunk());

  // when a final blow is landed, causing a ship to sink,
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

  // when a final blow is landed, causing a ship to sink,
  // attack all valid coordinates that make up an outline/border around it.
  // these coordinates are always empty, resulting in misses
  const sinkOutlineAroundSunkShips = () => {
    const allSunkCoordinates = [];
    const surroundingCells = [];

    // get coordinates of all sunk ships
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (boardArr[row][col].toString().includes('S'))
          allSunkCoordinates.push([row, col]);
      }
    }

    // get all adjacent & corner coordinates around a sunk ship, forming it's border
    allSunkCoordinates.forEach((coord) => {
      const adjacentCoordinates = getAllValidAdjacentCoordinates(coord);
      adjacentCoordinates.forEach((adjCoord) => {
        surroundingCells.push(adjCoord);
      });
      const cornerCoordinates = getCornerCoordinates(coord);
      cornerCoordinates.forEach((diagCoord) =>
        surroundingCells.push(diagCoord)
      );
    });

    // finally, update all surrounding cells with 'miss'
    surroundingCells.forEach((coordToAttack) => receiveAttack(coordToAttack));
  };

  // get valid moves along the same axis of 2 successful hits
  // * used by the enemy/computer's smart attack AI
  const getLinearNextMoves = (startPos, endPos) => {
    const linearNextMoves = [];
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;
    let coordinate;

    // if start/end position of 2 succuessful hits share a common row
    // the next move must be on a new column
    if (endRow === startRow) {
      let currentCol = startCol;

      // loop in a positive & then in a negative direction, along the same row,
      // until a missed attack, coordinate that falls outside the boundaries of the board
      // or an unplayed coordinate is found. if unplayed, add it to linearNextMoves.
      while (true) {
        coordinate = [startRow, currentCol++];
        if (!areCoordinatesInsideBoard(coordinate)) break;
        if (areCoordinatesAMiss(coordinate)) break;
        if (areCoordinatesUnplayed(coordinate)) {
          linearNextMoves.push(coordinate);
          break;
        }
      }
      currentCol = startCol;
      while (true) {
        coordinate = [startRow, currentCol--];
        if (!areCoordinatesInsideBoard(coordinate)) break;
        if (areCoordinatesAMiss(coordinate)) break;
        if (areCoordinatesUnplayed(coordinate)) {
          linearNextMoves.push(coordinate);
          break;
        }
      }
    } else {
      // start/end position share a common column: the next moves must be on a different row
      let currentRow = startRow;

      // loop in a positive & then in a negative direction, along the same column,
      // until a missed attack, coordinate that falls outside the boundaries of the board
      // or an unplayed coordinate is found. if unplayed, add it to linearNextMoves.
      while (true) {
        coordinate = [currentRow++, startCol];
        if (!areCoordinatesInsideBoard(coordinate)) break;
        if (areCoordinatesAMiss(coordinate)) break;
        if (areCoordinatesUnplayed(coordinate)) {
          linearNextMoves.push(coordinate);
          break;
        }
      }
      currentRow = startRow;
      while (true) {
        coordinate = [currentRow--, startCol];
        if (!areCoordinatesInsideBoard(coordinate)) break;
        if (areCoordinatesAMiss(coordinate)) break;
        if (areCoordinatesUnplayed(coordinate)) {
          linearNextMoves.push(coordinate);
          break;
        }
      }
    }

    // finally return all valid linear next moves
    return linearNextMoves;
  };

  // given a coordinate & a player or enemy's gameboard, return all valid adjacent coordinates:
  // ie: positions to the left, right, above and below a coordinate
  const getAllValidAdjacentCoordinates = (coordinates, boardObj = '') => {
    const [row, col] = coordinates;
    const allPossibleMoves = [];

    allPossibleMoves.push([row + 1, col]);
    allPossibleMoves.push([row - 1, col]);
    allPossibleMoves.push([row, col + 1]);
    allPossibleMoves.push([row, col - 1]);

    // filter out coordinates that are outside the gameboard OR coordinates
    // that have been played already
    const validNextMoves = allPossibleMoves.filter((coordinates) => {
      return !boardObj
        ? areCoordinatesUnplayedInsideBoard(coordinates)
        : boardObj.areCoordinatesUnplayedInsideBoard(coordinates);
    });

    return validNextMoves;
  };

  // given a coordinate, return coordinates around it that share a common corner
  // ie: coordinates above/left, above/right, below/left, below/right
  const getCornerCoordinates = (coordinates) => {
    const [row, col] = coordinates;
    const diagonalCoordinates = [];

    diagonalCoordinates.push([row - 1, col - 1]);
    diagonalCoordinates.push([row - 1, col + 1]);
    diagonalCoordinates.push([row + 1, col - 1]);
    diagonalCoordinates.push([row + 1, col + 1]);

    return diagonalCoordinates.filter((coord) =>
      areCoordinatesInsideBoard(coord)
    );
  };

  // given any two coordinates, return them & all coordinates that lie between them
  const getAllCoordinatesBetween = (startPos, endPos) => {
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;
    let allCoordinates = [];

    // if ship is placed vertically, get all row #'s between start/end pos
    if (startCol === endCol) {
      const allRowNumbers = getAllNumbersBetween(startRow, endRow);
      // assemble final coordinates, given a list of rows
      allCoordinates = allRowNumbers.map((row) => {
        return [row, startCol];
      });
    } else {
      // ship is place horizontally: get all col #'s between start/end pos
      const allColumnNumbers = getAllNumbersBetween(startCol, endCol);
      // assemble final coordinates, given a list of columns
      allCoordinates = allColumnNumbers.map((col) => {
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
    getAllValidAdjacentCoordinates,
    getLinearNextMoves,
    areCoordinatesEmpty,
    areCoordinatesInsideBoard,
    areCoordinatesUnplayedInsideBoard,
    canPlaceShipBetween,
    placeShip,
    sinkOutlineAroundSunkShips,
    receiveAttack,
    areAllShipsSunk,
  };
};
