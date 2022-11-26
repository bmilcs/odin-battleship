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

describe('gameboard factory: utility methods', () => {
  const board = Gameboard();

  test('get all positions between 2 positions', () => {
    expect(board.getAllPositionsBetween([0, 0], [0, 2])).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test('get all positions between 2 positions', () => {
    expect(board.getAllPositionsBetween([0, 0], [4, 0])).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ]);
  });
});

describe('gameboard factory: game play method tests', () => {
  const board = Gameboard(3);

  test('placeShip changes gameboard array', () => {
    board.placeShip([0, 0], [0, 2]);
    expect(board.getArray()).not.toBe([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  });

  test('receiveAttack on coordinates with no ship: miss, record attack', () => {
    board.receiveAttack([1, 0]);
    expect(board.getArray()[1][0]).toEqual('X');
  });
});
