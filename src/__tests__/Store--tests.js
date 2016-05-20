jest.autoMockOff();
const {
  injectStore,
  setState,
  store,
} = require.requireActual('../Store');

describe('Store', () => {
  describe('injectStore/get', () => {
    it('stores a copy, not the same instance', () => {
      const _store = {
        foo: true,
      };

      injectStore(_store);

      expect(store).not.toBe(_store);
    });
  });

  describe('setState', () => {
    it('uses the mapStateToProps to match a key and assign a value', () => {
      const _store = {
        foo: true,
        bar: {baz: true},
      };
      injectStore(_store);

      function mapStateToProps() {
        return {
          foo: 'foo',
          baz: 'bar.baz',
        };
      }

      setState(mapStateToProps, 'baz', false);

      expect(_store.bar.baz).toBeFalsy();
    });
  });
});
