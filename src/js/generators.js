/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const numberOfTypes = allowedTypes.length;
  while (true) {
    const randomTyp = Math.floor(Math.random() * numberOfTypes);
    const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
    yield new allowedTypes[randomTyp](randomLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const teamGenerator = characterGenerator(allowedTypes, maxLevel);
  const newTeam = [];
  for (let i = 0; i < characterCount; i += 1) {
    newTeam.push(teamGenerator.next().value);
  }
  return newTeam;
}
