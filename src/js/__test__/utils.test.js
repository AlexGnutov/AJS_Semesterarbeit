import {
  calcTileType,
  calcHealthLevel,
  linearToXY,
  XYtoLinear,
  makeTitle,
  getRandomFrom,
} from '../utils';

// calcTileType TEST
test.each([
  [0, 'top-left'],
  [7, 'top-right'],
  [1, 'top'],
  [56, 'bottom-left'],
  [63, 'bottom-right'],
  [60, 'bottom'],
  [15, 'right'],
  [16, 'left'],
  [20, 'center'],
])(
  ('To test correct calcTileType response'),
  (input, expected) => {
    const boardSize = 8;
    const result = calcTileType(input, boardSize);
    expect(result).toBe(expected);
  },
);

// calcHealthLevel TEST
test.each([
  [14, 'critical'],
  [43, 'normal'],
  [99, 'high'],
])(
  ('To test correct calcHealthLevel response'),
  (level, expected) => {
    const result = calcHealthLevel(level);
    expect(result).toBe(expected);
  },
);

// XYtoLinear TEST
test.each([
  [0, [0, 0]],
  [1, [1, 0]],
  [7, [7, 0]],
  [8, [0, 1]],
  [15, [7, 1]],
  [16, [0, 2]],
  [56, [0, 7]],
  [63, [7, 7]],
])(
  ('To test correct calcHealthLevel response'),
  (expected, input) => {
    const result = XYtoLinear(input);
    expect(result).toBe(expected);
  },
);

// linearToXX TEST
test.each([
  [0, { posX: 0, posY: 0 }],
  [1, { posX: 1, posY: 0 }],
  [7, { posX: 7, posY: 0 }],
  [8, { posX: 0, posY: 1 }],
  [15, { posX: 7, posY: 1 }],
  [16, { posX: 0, posY: 2 }],
  [56, { posX: 0, posY: 7 }],
  [63, { posX: 7, posY: 7 }],
])(
  ('To test correct calcHealthLevel response'),
  (level, expected) => {
    const result = linearToXY(level);
    expect(result).toEqual(expected);
  },
);

test('If make title works', () => {
  const sampleObject = {
    level: 1,
    attack: 2,
    defence: 3,
    health: 4,
  };
  const sample = '\u{1F396}1\u{2694}2\u{1F6E1}3\u{2764}4';
  const result = makeTitle(sampleObject);
  expect(result).toBe(sample);
});

test('If get random from works', () => {
  const sampleArray = [0, 1, 2, 3, 4];
  const sampleUse = getRandomFrom(sampleArray);
  const result = sampleArray.includes(sampleUse);
  expect(result).toBe(true);
});

test('If get random from works', () => {
  const sampleArray = [];
  const result = getRandomFrom(sampleArray);
  expect(result).toBe(null);
});
