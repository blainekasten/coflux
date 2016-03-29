export function stripAddress(author) {
  return author.split(/</)[0];
}
