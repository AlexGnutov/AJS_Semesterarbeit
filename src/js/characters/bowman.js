import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level);
    this.attack = Math.round(100 * (1 + 0.1 * (level - 1)));
    this.defence = 25;
    this.type = 'bowman';
  }
}
