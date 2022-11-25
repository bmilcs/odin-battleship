import Ship from "./ship";

test("isSunk() on new Ship object = false", () => {
  const shipFour = Ship(4);
  expect(shipFour.isSunk()).toBe(false);
});

test("isSunk() on ship(1) after 1 hit = true", () => {
  const shipOne = Ship(1);
  shipOne.hit();
  expect(shipOne.isSunk()).toBe(true);
});

test("isSunk() on ship(2) after 1 hit = false", () => {
  const shipTwo = Ship(2);
  shipTwo.hit();
  expect(shipTwo.isSunk()).toBe(false);
});