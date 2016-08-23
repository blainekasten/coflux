jest.autoMockOff();
const Store = require.requireActual('../Store');

describe('Store', () => {
  describe('injectStore/get', () => {
    it('stores a copy, not the same instance', () => {
      const _store = {
        foo: true,
      };

      Store.injectStore(_store);

      expect(Store.getState()).not.toBe(_store);
    });
  });

  describe('setState', () => {
    it('uses the mapStateToProps to match a key and assign a value', () => {
      const _store = {
        foo: true,
        bar: {baz: true},
      };
      Store.injectStore(_store);

      function mapStateToProps() {
        return {
          foo: 'foo',
          baz: 'bar.baz',
        };
      }

      Store.setState(mapStateToProps, 'baz', false);

      expect(_store.bar.baz).toBeFalsy();
    });
  });
});
