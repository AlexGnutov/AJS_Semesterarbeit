import GameState from '../GameState';
import Deamon from '../characters/deamon';
import Unit from '../Unit';
import Team from '../Team';

test('new GameState test', () => {
  const expected = {
    playerTeam: undefined,
    enemyTeam: undefined,
    units: [],
    nextTurn: 'player',
    selectedCell: null,
    currentGameScore: 0,
    scores: [],
    currentLevel: 0,
  };
  const result = new GameState();
  expect(result).toEqual(expected);
});

test('getSelectedCell() test', () => {
  const sample = new GameState();
  sample.selectedCell = 19;

  const result = sample.getSelectedCell();
  expect(result).toBe(19);
});

test('getAllUnitsCells', () => {
  const sample = new GameState();
  sample.units = [
    { position: 2 },
    { position: 3 },
    { position: 4 },
  ];
  const expected = new Set([2, 3, 4]);

  const result = sample.getAllUnitsCells();
  expect(new Set(result)).toEqual(expected);
});

test('getAllPlayerCells()', () => {
  const sample = new GameState();

  const p1 = new Deamon(1);
  const p2 = new Deamon(1);
  const p3 = new Deamon(1);

  sample.playerTeam = { members: [p1, p2, p3] };

  sample.units = [
    new Unit(p1, 1),
    new Unit(p2, 2),
    new Unit(p3, 3),
    new Unit(new Deamon(1), 1),
  ];

  const expected = new Set([1, 2, 3]);
  const result = sample.getAllPlayerCells();
  expect(new Set(result)).toEqual(expected);
});

test('getAllEnemyCells()', () => {
  const sample = new GameState();

  const p1 = new Deamon(1);
  const p2 = new Deamon(1);
  const p3 = new Deamon(1);

  sample.enemyTeam = { members: [p1, p2, p3] };

  sample.units = [
    new Unit(p1, 1),
    new Unit(p2, 2),
    new Unit(p3, 3),
    new Unit(new Deamon(1), 1),
  ];

  const expected = new Set([1, 2, 3]);
  const result = sample.getAllEnemyCells();
  expect(new Set(result)).toEqual(expected);
});

test('getUnitFromCell()', () => {
  const sample = new GameState();
  const p1 = new Deamon(1);
  sample.units = [
    new Unit(p1, 1),
  ];

  const expected = new Unit(p1, 1);
  const result = sample.getUnitFromCell(1);
  expect(result).toEqual(expected);
});

test('removeCharacter() from player team', () => {
  const sample = new GameState();

  const p1 = new Deamon(1);
  const p2 = new Deamon(2);
  sample.playerTeam = { members: [p1] };
  sample.enemyTeam = { members: [p2] };

  const unit1 = new Unit(p1, 1);
  const unit2 = new Unit(p2, 2);
  sample.units = [unit1, unit2];

  sample.removeCharacter(unit1);

  const result = sample.playerTeam.members;

  expect(result).toEqual([]);
});

test('removeCharacter() from enemy team', () => {
  const sample = new GameState();

  const p1 = new Deamon(1);
  const p2 = new Deamon(2);
  sample.playerTeam = { members: [p1] };
  sample.enemyTeam = { members: [p2] };

  const unit1 = new Unit(p1, 1);
  const unit2 = new Unit(p2, 2);
  sample.units = [unit1, unit2];

  sample.removeCharacter(unit2);

  const result = sample.enemyTeam.members;

  expect(result).toEqual([]);
});

test('Recover from loaded test', () => {
  const sampleState = {
    currentLevel: 1,
    nextTurn: 'player',
    units: [
      { character: { type: 'daemon', level: 1, health: 100 }, position: 2 },
    ],
  };

  const expected = {
    playerTeam: new Team('Humans', 0, 1),
    enemyTeam: new Team('Darkens', 0, 1),
    units: [new Unit(new Deamon(1), 2)],
    nextTurn: 'player',
    selectedCell: null,
    currentGameScore: 0,
    scores: [],
    currentLevel: 1,
  };

  expected.enemyTeam.members.push(new Deamon(1));
  const sample = new GameState();
  sample.recoverFromLoaded(sampleState);

  expect(sample).toEqual(expected);
});
