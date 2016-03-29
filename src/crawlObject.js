/*
 * @flow
 */
/*
 * TODO: Add file heading
 * TODO: Add flow
 * TODO: Add dev errors
 */
export default function crawlObject(object:Object|Array<any>, stringifiedPath:string) : any {
  const paths = stringifiedPath.split('.');
  const path = paths.splice(0, 1)[0];
  let foundPath;

  // assuming we are on an array..
  // should have smart stuff around this
  if (path.indexOf('{') !== -1 ) {
    const objectPieces = path.split(/({|:|})/);
    const key = objectPieces[2];
    const value = objectPieces[4].trim();
    let index;


    object.forEach((item, i) => {
      if (item[key] === value) {
        index = i;
      }
    });

    foundPath = object[index];
  } else {
    foundPath = object[path];
  }

  if (paths.length > 0) {
    return crawlObject(foundPath, paths.join('.'));
  }

  return foundPath;
}
