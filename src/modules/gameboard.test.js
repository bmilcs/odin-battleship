import Gameboard from './gameboard';

describe('gameboard factory: creating gameboards', () => {
  test('create a new gameboard array, default size: 10', () => {
    const board = Gameboard();
    expect(board.getArray()).toStrictEqual([
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ]);
  });

  test('create a new gameboard array, non default size: 3', () => {
    const board = Gameboard(3);
    expect(board.getArray()).toStrictEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  });
});

describe('gameboard factory: utility functions', () => {
  const board = Gameboard();

  test('get all positions between 2 positions', () => {
    expect(board.getAllCoordinatesBetween([0, 0], [0, 2])).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test('get all positions between 2 positions', () => {
    expect(board.getAllCoordinatesBetween([0, 0], [4, 0])).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ]);
  });
});

describe('gameboard factory: game play function tests', () => {
  const board = Gameboard(3);
  const boardArr = board.getArray();

  test('placeShip: ship #0 added to gameboard array', () => {
    board.placeShip([0, 0], [0, 2]);
    expect(board.getArray()).toEqual([
      [0, 0, 0],
      ['', '', ''],
      ['', '', ''],
    ]);
  });

  test('placeShip: ship #1 added to gameboard array', () => {
    board.placeShip([1, 0], [2, 0]);
    expect(board.getArray()).toEqual([
      [0, 0, 0],
      [1, '', ''],
      [1, '', ''],
    ]);
  });

  test('areCoordinatesEmpty on an empty cell', () => {
    expect(board.areCoordinatesEmpty([1, 1])).toEqual(true);
  });

  test('areCoordinatesEmpty on a cell with a ship in it', () => {
    expect(board.areCoordinatesEmpty([0, 0])).toEqual(false);
  });

  test('areCoordinatesInsideBoard [0, 0]', () => {
    expect(board.areCoordinatesInsideBoard([0, 0])).toEqual(true);
  });

  test('areCoordinatesInsideBoard [3, 3]', () => {
    expect(board.areCoordinatesInsideBoard([3, 3])).toEqual(false);
  });

  test('receiveAttack on coordinates with no ship: miss, record attack', () => {
    board.receiveAttack([1, 1]);
    expect(board.getArray()[1][1]).toEqual('M');
  });

  test('receiveAttack on coordinates with no ship: miss, record attack', () => {
    board.receiveAttack([1, 2]);
    expect(board.getArray()[1][2]).toEqual('M');
  });

  test('receiveAttack on coordinates with a ship: hit, record attack', () => {
    board.receiveAttack([0, 0]);
    expect(board.getArray()[0][0]).toEqual('0X');
  });

  test('areAllShipsSunk(): false test', () => {
    expect(board.areAllShipsSunk()).toBeFalsy();
  });

  test('areAllShipsSunk(): true, after sinking all ships', () => {
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    board.receiveAttack([1, 0]);
    board.receiveAttack([2, 0]);
    expect(board.areAllShipsSunk()).toBeTruthy();
  });
});
