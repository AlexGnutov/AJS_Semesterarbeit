/**
 * @description Returns tile style, depending on position
 */
export function calcTileType(index, boardSize) {
  // 1) Set corners positions
  const corners = [
    [0, 'top-left'],
    [boardSize - 1, 'top-right'],
    [boardSize * (boardSize - 1), 'bottom-left'],
    [(boardSize * boardSize) - 1, 'bottom-right'],
  ];
  // Check, if tile in corner and return if it is
  const ifCorner = corners.findIndex((element) => element[0] === index);
  if (ifCorner >= 0) {
    return corners[ifCorner][1];
  }

  // 2) Set top and bottom positions
  const topAndBottom = [
    [1, boardSize - 2, 'top'],
    [boardSize * (boardSize - 1) + 1, (boardSize * boardSize) - 2, 'bottom'],
  ];
  // Check, if tile in top or bottom, and return if it is
  const ifTopBot = topAndBottom.findIndex((elem) => (elem[0] <= index && index <= elem[1]));
  if (ifTopBot >= 0) {
    return topAndBottom[ifTopBot][2];
  }

  // 3) Set coords of left and right columns
  const leftColumnNumbers = [];
  const rightColumnNumbers = [];
  for (let i = 1; i <= (boardSize - 1); i += 1) {
    leftColumnNumbers.push(i * boardSize);
    rightColumnNumbers.push(i * boardSize + (boardSize - 1));
  }
  // Check, if the tile in on of then and return
  if (leftColumnNumbers.indexOf(index) >= 0) {
    return 'left';
  }
  if (rightColumnNumbers.indexOf(index) >= 0) {
    return 'right';
  }

  // 4) The rest are in 'center'
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}

/**
 * @description Combines unit data in a string for title
 */
export function makeTitle(obj) {
  return `\u{1F396}${obj.level}\u{2694}${obj.attack}\u{1F6E1}${obj.defence}\u{2764}${obj.health}`;
}

/**
 * @description Converts linear position to XY pair
 */
export function linearToXY(position) {
  const boardSize = 8;
  const posX = position % boardSize;
  const posY = (position - posX) / 8;
  return { posX, posY };
}

/**
 * @description Converts XY pair to linear position
 */
export function XYtoLinear(pair) {
  const boardSize = 8;
  return (boardSize * pair[1] + pair[0]);
}

/**
 * @description Service function: returns random element from given array
 */
export function getRandomFrom(array) {
  if (array.length > 0) {
    const number = Math.floor(Math.random() * array.length);
    return array[number];
  }
  return null;
}
