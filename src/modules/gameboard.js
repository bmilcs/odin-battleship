import Ship from "./ship";

export default (boardSize = 10) => {
  
  // create gameboard of defaultSize x defaultSize
  const create = (boardSize) => {
    let board = [];
    for (let row = 0; row < boardSize; row++) {
      board[row] = [];
      for (let col = 0; col < boardSize; col++) {
        board[row][col] = "";
      }
    }
    return board;
  }

  // print contents of gameboard to array
  const print = () => {
    console.log(array);
    array.forEach((row, i) => {
      console.log(`${i} ${row}`);
    })
  }

  // place ships at positions by calling Ship factory function
  const placeShip = (startPos, endPos) => {
    const allPositions = getAllPositionsBetween(startPos, endPos);
    const newShip = Ship(allPositions.length);

    // update board array
    allPositions.forEach(pos => {
      const [row, col] = pos;
      array[row][col] = newShip;
    })
  }
  
  const getAllPositionsBetween = (startPos, endPos) => {
    let arrayOfPositions = [];
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;

    const rowDiff = Math.abs(startRow - endRow);

    // if ship is placed up/down, get all coordinates between start/end pos
    if (rowDiff > 0) {
      const rowNumbers = getAllNumbersBetween(startRow, endRow);
      arrayOfPositions = rowNumbers.map((row) => {
        return [row, startCol];
      })
    } else {
      const colNumbers = getAllNumbersBetween(startCol, endCol);
      arrayOfPositions = colNumbers.map((col) => {
        return [startRow, col];
      })
    };

    return arrayOfPositions;
  }

  // returns all integers between 2 or more integers
  const getAllNumbersBetween = (x,y) => {
    const numbers = [];
    let high, low;
    if (x > y) {
      high = x;
      low = y;
    } else {
      high = y;
      low = x;
    }
    for (let i = low; i <= high; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  const positionsWithinBoard = (startPos, endPos) => {
    // make sure start & end coordinates fall within the bounds of the board
  }

  const positionsAreEmpty = (startPos, endPos) => {
    // make sure start & end coordinates are empty
  }
  
  const getArray = () => {
    return array;
  }

  const array = create(boardSize);


  return {
    getArray,
    placeShip,
    getAllPositionsBetween
  }
}