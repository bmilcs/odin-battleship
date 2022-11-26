import Ship from './ship';

describe('Ship factory & methods tests', () => {
  const shipFour = Ship(4);

  test('isSunk() on new Ship(4) object = false', () => {
    expect(shipFour.isSunk()).toBe(false);
  });

  test('isSunk() on ship(4) after 3 hits = false', () => {
    shipFour.hit();
    shipFour.hit();
    shipFour.hit();
    expect(shipFour.isSunk()).toBe(false);
  });

  test('isSunk() on ship(4) after 1 more hit = true', () => {
    shipFour.hit();
    expect(shipFour.isSunk()).toBe(true);
  });
});
