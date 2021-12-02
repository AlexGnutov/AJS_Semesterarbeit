import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.attack = Math.round(40 * (1 + 0.1 * (level - 1)));
    this.defence = 10;
    this.type = 'undead';
  }
}
