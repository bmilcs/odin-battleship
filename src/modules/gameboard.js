import Ship from './ship';

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

  // place ships at positions by calling Ship factory function
  const placeShip = (startPos, endPos) => {
    const allPositions = getAllPositionsBetween(startPos, endPos);
    const newShip = Ship(allPositions.length);

    // update board array
    allPositions.forEach((pos) => {
      const [row, col] = pos;
      array[row][col] = newShip;
    });
  };

  // receive attack: if ship is hit, send .hit()
  // if miss, record attack
  const receiveAttack = (coordinates) => {
    const [row, col] = coordinates;
    const positionValue = array[row][col];

    if (typeof positionValue === 'Object') {
      positionValue.hit();
    } else {
      array[row][col] = 'X';
    }
  };

  const getAllPositionsBetween = (startPos, endPos) => {
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
    for (let i = low; i <= high; i++) {
      numbers.push(i);
    }
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
    console.log(array);
    array.forEach((row, i) => {
      console.log(`${i} ${row}`);
    });
  };

  const getArray = () => {
    return array;
  };

  const array = create(boardSize);

  return {
    getArray,
    getAllPositionsBetween,
    placeShip,
    receiveAttack,
  };
};
