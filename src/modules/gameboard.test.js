import Gameboard from "./gameboard";

describe("gameboard factory & method tests", () => {

  test("create a new gameboard array, default size: 10", () => {
    const board = Gameboard();
    expect(board.getArray()).toStrictEqual([["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""]]);
  })

  test("create a new gameboard array, non default size: 3", () => {
    const board = Gameboard(3);
    expect(board.getArray()).toEqual([["", "", ""], ["", "", ""], ["", "", ""]]);
  })

  test("get all positions between 2 positions", () => {
    const board = Gameboard(3);
    expect(board.getAllPositionsBetween([0, 0], [0, 2])).toEqual([[0, 0], [0, 1], [0, 2]]);
  })

  test("get all positions between 2 positions", () => {
    const board = Gameboard(6);
    expect(board.getAllPositionsBetween([0, 0], [4, 0])).toEqual([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]);
  })

  test("placeShip changes gameboard array", () => {
    const board = Gameboard(3);
    board.placeShip([0, 0], [0, 2]);
    expect(board.getArray()).not.toEqual([["", "", ""], ["", "", ""], ["", "", ""]]);
  })

});