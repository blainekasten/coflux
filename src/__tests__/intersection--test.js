const intersection = require.requireActual('../intersection');

describe('Intersection', () => {
  describe('primitives', () => {
    const dominant = { foo: 1, bar: 2, baz: 3, faz: 4 };
    const slave = { foo: 2, bar: 2, baz: 2, far: 5 };

    const result = intersection(dominant, slave);

    it('should give the first object dominance', () => {
      expect(result.foo).toBe(dominant.foo);
    });

    it('should not contain values that are the same', () => {
      expect(result.bar).toBeUndefined();
    });

    it('should handle multiple keys', () => {
      expect(result.baz).toBe(dominant.baz);
    });

    it('should not be able to add keys', () => {
      expect(result.faz).toBeUndefined();
    });

    it('should ignore slave keys that aren\'t part of the dominant', () => {
      expect(result.hasOwnProperty('far')).toBeFalsy();
    });
  });

  describe('objects', () => {
    it('should return the root object when internal values are different', () => {
      const dominant = { foo: { bar: 1 }, baz: { bax: 2 } };
      const slave = { foo: { bar: 1 }, baz: { bax: 3 } };

      const result = intersection(dominant, slave);

      expect(result.baz.bax).toBe(2);
      expect(result.foo).toBeUndefined();
    });
  });

  describe('Promise', () => {
    /*
     * This is a bugfix where the comparison of a promise coming in for playables
     * did not properly update internally because intersection said they were the same thing
     *
     * Always returning a promise is smart because we can't actually know what the value is going to be
     */
    it('always returns the dominant value when the dominant value is a Promise', () => {
      const _promisedPlayables = new Promise(resolve => resolve([1, 2, 3]));
      const slave = { _promisedPlayables: {} };
      const dominant  = { _promisedPlayables };

      const result = intersection(dominant, slave);

      expect(result._promisedPlayables).toBe(_promisedPlayables);
    });
  });

  describe('array', () => {
    it('should return the root object when primitives are different', () => {
      const dominant = { foo: [0, 1, 2] };
      const slave = { foo: [3, 4, 5] };

      const { foo } = intersection(dominant, slave);

      expect(foo.length).toBe(3);
      expect(foo[0]).toBe(0);
      expect(foo[1]).toBe(1);
      expect(foo[2]).toBe(2);
    });

    it('should not return the root object when primitives are identical', () => {
      const dominant = { foo: [0, 1, 2] };
      const slave = { foo: [0, 1, 2] };

      const { foo } = intersection(dominant, slave);

      expect(foo).not.toBeDefined();
    });

    it('should return the root object when index values are unique objects', () => {
      const dominant = { foo: [0, { bar: true }, 2] };
      const slave = { foo: [0, { bar: false }, 2] };

      const { foo } = intersection(dominant, slave);

      expect(foo.length).toBe(3);
      expect(foo[0]).toBe(0);
      expect(foo[1].bar).toBe(true);
      expect(foo[2]).toBe(2);
    });

    it('should not return an object when index values are identical objects', () => {
      const dominant = { foo: [0, { bar: true }, 2] };
      const slave = { foo: [0, { bar: true }, 2] };

      const { foo } = intersection(dominant, slave);

      expect(foo).not.toBeDefined();
    });

    it('should return the root object when nested arrays are unique', () => {
      const dominant = { foo: [0, [1, true], 2] };
      const slave = { foo: [0, [1, false], 2] };

      const { foo } = intersection(dominant, slave);

      expect(foo[0]).toBe(0);
      expect(foo[1][0]).toBe(1);
      expect(foo[1][1]).toBe(true);
      expect(foo[2]).toBe(2);
    });

    it('should return the root object when nested arrays are unique', () => {
      const dominant = { foo: [0, [1, 2], 2] };
      const slave = { foo: [0, [1, 2], 2] };

      const { foo } = intersection(dominant, slave);

      expect(foo).not.toBeDefined();
    });
  });
});

