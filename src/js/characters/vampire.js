import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.attack = Math.round(25 * (1 + 0.1 * (level - 1)));
    this.defence = 25;
    this.type = 'vampire';
  }
}
