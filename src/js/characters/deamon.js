import Character from '../Character';

export default class Deamon extends Character {
  constructor(level) {
    super(level);
    this.attack = Math.round(10 * (1 + 0.1 * (level - 1)));
    this.defence = 40;
    this.type = 'daemon';
  }
}
