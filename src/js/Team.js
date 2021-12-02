import { generateTeam } from './generators';
import Bowman from './characters/bowman';
import Swordsman from './characters/swordsman';
import Magician from './characters/magician';
import Vampire from './characters/vampire';
import Undead from './characters/undead';
import Deamon from './characters/deamon';

export default class Team {
  constructor(side, membersNumber, maxLevel, allowedTypes) {
    this.side = side;
    if (side === 'Humans') {
      const allowed = allowedTypes || [Swordsman, Bowman, Magician];
      this.members = generateTeam(allowed, maxLevel, membersNumber);
    }
    if (side === 'Darkens') {
      const allowed = allowedTypes || [Vampire, Undead, Deamon];
      this.members = generateTeam(allowed, maxLevel, membersNumber);
    }
  }

  /**
   * @description This method allows to make new character with
   * needed specification. Used for saved data recovering.
   * @param {*} type exact unit type
   * @param {*} level exact unit level
   * @param {*} health exact health value
   * @returns new character to make new unit
   */
  addCharacter(type, level, health) {
    const typeMatrix = [
      ['swordsman', Swordsman],
      ['bowman', Bowman],
      ['magician', Magician],
      ['undead', Undead],
      ['vampire', Vampire],
      ['daemon', Deamon],
    ];
    // Select proper constructor
    const typeIndex = typeMatrix.findIndex((t) => t[0] === type);
    const newCharacter = new typeMatrix[typeIndex][1](level);
    // Set health level
    newCharacter.health = health;
    this.members.push(newCharacter);
    return newCharacter; // to use it later
  }
}
