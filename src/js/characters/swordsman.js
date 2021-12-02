import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.attack = Math.round(100 * (1 + 0.1 * (level - 1)));
    this.defence = 10;
    this.type = 'swordsman';
  }
}
