/**
 * Intersection method for shallow objects
 *
 * @providesModule Intersection
 * @private
 * @internal
 * @flow
 */

export default (dominantObject: Object, slaveObject: Object) => {
  const intersectedObject: Object = {};

  for (const key: string in slaveObject) {
    if (!dominantObject.hasOwnProperty(key)) {
      continue;
    }

    const dominantKeyValue: any = dominantObject[key];

    if (dominantKeyValue !== slaveObject[key]) {
      intersectedObject[key] = dominantKeyValue;
    }
  }

  return intersectedObject;
};
