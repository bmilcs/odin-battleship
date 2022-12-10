//
// Ship Factory
//

export default (shipLength) => {
  const length = shipLength;
  let hits = 0;

  const hit = () => ++hits;

  const isSunk = () => {
    return length === hits ? true : false;
  };

  return { hit, isSunk };
};
