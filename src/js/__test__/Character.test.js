import Character from '../Character';
import Deamon from '../characters/deamon';
import Bowman from '../characters/bowman';
import Swordsman from '../characters/swordsman';
import Magician from '../characters/magician';
import Vampire from '../characters/vampire';
import Undead from '../characters/undead';

test('Test, if direct use of new Character is prohibited', () => {
  function check() {
    return new Character(1);
  }
  expect(check).toThrowError('Direct call of Character constructor is prohibited');
});

test('Test, if Deamon can be created', () => {
  const expected = {
    attack: 10,
    level: 1,
    defence: 40,
    type: 'daemon',
    health: 100,
  };
  const sample = new Deamon(1);
  expect(sample).toEqual(expected);
});

test('Test, if Unded can be created', () => {
  const expected = {
    attack: 40,
    level: 1,
    defence: 10,
    type: 'undead',
    health: 100,
  };
  const sample = new Undead(1);
  expect(sample).toEqual(expected);
});

test('Test, if Vampire can be created', () => {
  const expected = {
    attack: 25,
    level: 1,
    defence: 25,
    type: 'vampire',
    health: 100,
  };
  const sample = new Vampire(1);
  expect(sample).toEqual(expected);
});

test('Test, if Bowman can be created', () => {
  const expected = {
    attack: 100,
    level: 1,
    defence: 25,
    type: 'bowman',
    health: 100,
  };
  const sample = new Bowman(1);
  expect(sample).toEqual(expected);
});

test('Test, if Swordsman can be created', () => {
  const expected = {
    attack: 100,
    level: 1,
    defence: 10,
    type: 'swordsman',
    health: 100,
  };
  const sample = new Swordsman(1);
  expect(sample).toEqual(expected);
});

test('Test, if Magiciam can be created', () => {
  const expected = {
    attack: 10,
    level: 1,
    defence: 40,
    type: 'magician',
    health: 100,
  };
  const sample = new Magician(1);
  expect(sample).toEqual(expected);
});
