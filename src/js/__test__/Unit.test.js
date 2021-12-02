import Deamon from '../characters/deamon';
import Unit from '../Unit';

test('', () => {
  function check() {
    return new Unit(new Deamon(1), 'a');
  }
  expect(check).toThrowError('position must be a number');
});

test('', () => {
  function check() {
    return new Unit({ deamo: 1 }, 'a');
  }
  expect(check).toThrowError('character must be instance of Character or its children');
});

test('', () => {
  const sample = { character: new Deamon(1), position: 1 };
  const result = new Unit(new Deamon(1), 1);

  expect(result).toEqual(sample);
});

test.each([
  1, 2, 4, 8,
])(
  ('Test start positions for Humans'),
  (number) => {
    const allowedPositions = [0, 1, 8, 9, 16, 17, 24,
      25, 32, 33, 40, 41, 48, 49, 56, 57];
    const resultat = Unit.getStartPos(number, 8, 'Humans');
    expect(allowedPositions).toEqual(expect.arrayContaining(resultat));
  },
);

test.each([
  1, 2, 4, 8,
])(
  ('Test start positions for Darkens'),
  (number) => {
    const allowedPositions = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    const resultat = Unit.getStartPos(number, 8, 'Darkens');
    expect(allowedPositions).toEqual(expect.arrayContaining(resultat));
  },
);

test('Test wrong team name', () => {
  function check() {
    Unit.getStartPos(8, 8, 'Dark');
  }
  expect(check).toThrowError('getStartPosition: Wrong team type');
});

test('Test too many position requested', () => {
  const result = Unit.getStartPos(17, 8, 'Darkens');
  expect(result).toEqual([]);
});

test('Test allowed to go', () => {
  const sample = new Deamon(1);
  const position = 0;
  const allowed = new Set([1, 9, 8]);
  const unit = new Unit(sample, position);
  const result = unit.getAllowedToGo();
  expect(new Set(result)).toEqual(allowed);
});

test('Test allowed to attack', () => {
  const sample = new Deamon(1);
  const position = 0;
  const allowed = new Set([1, 2, 3, 4, 8, 9,
    10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36]);
  const unit = new Unit(sample, position);
  const result = unit.getAllowedToAttack();
  expect(new Set(result)).toEqual(allowed);
});

test('Test attack', () => {
  const sample1 = new Unit(new Deamon(1), 1);
  const sample2 = new Unit(new Deamon(1), 2);
  const result = sample1.attacks(sample2);
  expect(result).toBe(5);
});
