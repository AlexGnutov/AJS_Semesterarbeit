import Character from './Character';
import { movements, attacks } from './actions';
import { linearToXY, XYtoLinear } from './utils';

export default class Unit {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
    this.character = character;
    this.position = position;
  }

  /**
   * @description Gives desired number of start positions
   */
  static getStartPos(number, boardSize, side) {
    let columns;
    if (side === 'Humans') {
      columns = [0, 1];
    } else if (side === 'Darkens') {
      columns = [6, 7];
    } else {
      throw new Error('getStartPosition: Wrong team type');
    }

    const allowed = []; // Array for allower positions (dependin the side)
    for (let i = 0; i <= boardSize - 1; i += 1) {
      allowed.push(columns[0] + i * boardSize);
      allowed.push(columns[1] + i * boardSize);
    }

    const selected = []; // Array to collect desirable number of random positions
    if (number <= boardSize * 2) {
      for (let i = 0; i < number; i += 1) {
        const random = Math.floor(Math.random() * allowed.length);
        selected.push(allowed.splice(random, 1)[0]);
      }
    }
    return selected;
  }

  /**
   *
   * @returns array with cells allowed to go to
   */
  getAllowedToGo() {
    const { posX, posY } = linearToXY(this.position);
    const maxSteps = movements.filter((elem) => elem[0] === this.character.type)[0][1];

    const allowed = []; // Collects all possible cells
    for (let i = 1; i <= maxSteps; i += 1) {
      allowed.push([posX - i, posY - i]);
      allowed.push([posX + i, posY + i]);
      allowed.push([posX - i, posY + i]);
      allowed.push([posX + i, posY - i]);
      allowed.push([posX, posY + i]);
      allowed.push([posX, posY - i]);
      allowed.push([posX + i, posY]);
      allowed.push([posX - i, posY]);
    }
    // Filter away cell coordintes, which are outside the field
    const filtered = allowed.filter((p) => ((p[0] >= 0 && p[1] >= 0) && (p[0] < 8 && p[1] < 8)));
    return filtered.map((pair) => XYtoLinear(pair));
  }

  /**
   *
   * @returns array with cells allowed for attack
   */
  getAllowedToAttack() {
    const { posX, posY } = linearToXY(this.position);
    const maxSteps = attacks.filter((elem) => elem[0] === this.character.type)[0][1];

    const corner = [posX - maxSteps, posY - maxSteps];
    const allowed = [];

    for (let i = 0; i <= maxSteps * 2; i += 1) {
      for (let k = 0; k <= maxSteps * 2; k += 1) {
        allowed.push([corner[0] + k, corner[1] + i]);
      }
    }
    // Remove center cell, where character is
    allowed.splice((((maxSteps * 2 + 1) * (maxSteps * 2 + 1) - 1) / 2), 1);

    // Filter away cell coordintes, which are outside the field
    const filtered = allowed.filter((p) => ((p[0] >= 0 && p[1] >= 0) && (p[0] < 8 && p[1] < 8)));
    return filtered.map((pair) => XYtoLinear(pair));
  }

  /**
   * @description Calculates result from attack
   * @param {*} target unit under attack
   * @returns damage level
   */
  attacks(target) {
    const aUnit = this.character;
    const dUnit = target.character;
    const damage = Math.round(Math.max(aUnit.attack - dUnit.defence, aUnit.attack * 0.5));
    dUnit.health -= damage;
    return damage;
  }
}
