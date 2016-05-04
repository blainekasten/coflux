window.requestAnimationFrame = jest.genMockFunction();

const updateState = jest.genMockFunction();
jest.setMock('../updateState', updateState);
const bindActions = require.requireActual('../bindActions');

const component = {
  context: { state: {} },
  name() { return 'MockComponent'; },
  props: {
    mapStateToProps() {
      return { firstName: 'user.firstName' };
    },
  },
  propsForComponent() {
    return { firstName: 'foo' };
  },
}

describe('bindActions', () => {
  it('creates a wrapper around the actions', () => {
    const foo = () => {};
    const actions = bindActions.call(component, {
      foo,
    });

    expect(actions.foo).not.toBe(foo);
  });

  describe('arguments `actions` recieve', () => {
    const foo = jest.genMockFunction();
    const actions = bindActions.call(component, {
      foo,
    });

    actions.foo('thirdArg');

    it('receives `props`', () => {
      expect(foo.mock.calls[0][0]).toEqual(component.propsForComponent());
    });

    it('receives `next()` method', () => {
      expect(typeof foo.mock.calls[0][1]).toBe('function');
    });

    it('receives any additional args', () => {
      expect(foo.mock.calls[0][2]).toBe('thirdArg');
    });
  });

  describe('arguments updateState receives from next()', () => {
    const foo = (props, next) => {
      next({firstName: 'bar'});
    };

    const actions = bindActions.call(component, {
      foo,
    });

    actions.foo('thirdArg');

    it('receives, mapStateToProps method', () => {
      const mapStateWrapperCall = updateState.mock.calls[0][0]();
      const mapStateNormalCall = component.props.mapStateToProps();

      expect(mapStateWrapperCall).toEqual(mapStateNormalCall);
    });

    it('receives the updateObject', () => {
      expect(updateState.mock.calls[0][1]).toEqual({firstName: 'bar'});
    });

    it('receives the component name', () => {
      expect(updateState.mock.calls[0][2]).toEqual(component.name());
    });
  });
});
