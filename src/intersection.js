/**
 * Intersection method for shallow objects
 *
 * @providesModule Intersection
 * @private
 * @internal
 * @flow
 */

/*
 * Tells us, on a nested basis, if objects are the same, or differ at some level
 */
function objectsAreDifferent(dominantObject: Object, slaveObject: Object) : boolean {
  for (const key:string in dominantObject) {
    if (!dominantObject.hasOwnProperty(key)) {
      continue;
    }

    const dominantKeyValue: any = dominantObject[key];
    const slaveKeyValue: any = slaveObject[key];

    if (!slaveKeyValue) {
      return true;
    }

    if (typeof dominantKeyValue === 'object') {
      return objectsAreDifferent(dominantKeyValue, slaveKeyValue);
    }

    if (dominantKeyValue !== slaveKeyValue) {
      return true;
    }
  }

  return false;
}

/*
 * compares arrays in a nested basis
 */
function arraysAreDifferent(dominantArray: Array<any>, slaveArray: Array<any>) : boolean {
  // if array has been `push`ed to, it is different
  if (slaveArray.length !== dominantArray.length) {
    return true;
  }

  const responseValues = dominantArray.map((dominantIndexValue, index) => {
    const slaveIndexValue: any = slaveArray[index];

    if (Array.isArray(dominantIndexValue)) {
      return arraysAreDifferent(dominantIndexValue, slaveIndexValue);
    } else if (typeof dominantIndexValue === 'object') {
      return objectsAreDifferent(dominantIndexValue, slaveIndexValue);
    }

    return dominantIndexValue !== slaveIndexValue;
  });

  return responseValues.indexOf(true) !== -1;
}

/*
 * Validates object comparisons and returns the deep nested object that
 * is unique.
 *
 * For example,
 * if you compared these to objects:
 *
 * ```js
 * {
 *   foo: { bar: 1 }
 *   baz: { bax: 2 }
 * }
 * {
 *   foo: { bar: -1 },
 *   baz: { bax: 2 },
 * }
 * ```
 *
 * These two have the same `baz` value, but unique `foo` values. Thus
 * our expected result would be to include the foo object.
 *
 * ```js
 * { foo: { bar: -1 } }
 * ```
 */
export default function intersection(dominantObject: Object, slaveObject: Object) : Object {
  const intersectedObject: Object = {};

  for (const key:string in dominantObject) {
    if (!slaveObject.hasOwnProperty(key)) {
      continue;
    }

    const dominantKeyValue:any = dominantObject[key];
    const slaveKeyValue:any = slaveObject[key];

    if (Array.isArray(dominantKeyValue)) {
      if (arraysAreDifferent(dominantKeyValue, slaveKeyValue)) {
        intersectedObject[key] = dominantKeyValue;
      }

      continue;
    } else if (typeof dominantKeyValue === 'object') {
      if (typeof dominantKeyValue.then === 'function') {
        intersectedObject[key] = dominantKeyValue;
      } else if (objectsAreDifferent(dominantKeyValue, slaveKeyValue)) { // check to see if nested object is different
        intersectedObject[key] = dominantKeyValue;
      }

      continue;
    } else if (dominantKeyValue !== slaveKeyValue) {
      intersectedObject[key] = dominantKeyValue;
    }
  }

  return intersectedObject;
}

