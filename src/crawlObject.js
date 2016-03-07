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

  const foundPath = object[path];

  if (paths.length > 0) {
    return crawlObject(foundPath, paths.join('.'));
  }

  return foundPath;
}
