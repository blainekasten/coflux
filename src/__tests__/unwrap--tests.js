jest.autoMockOff();

const React = require('react');
const unwrap = require('../unwrapComponent');
const wrap = require('../wrapComponent');
const { mount } = require('enzyme');

const store = {
  foo: 'bar',
  bar: 'baz',
};

const Comp = ({actions, foo}) => (
  <div onClick={actions.updateFoo}>
    {foo}
  </div>
);

const Fixture = wrap(Comp, {
  mapStateToProps() {
    return {
      foo: 'foo',
    };
  },

  actions: {
    updateFoo(state, next) {
      next({foo: 'barf'});
    }
  },
});

window.requestAnimationFrame = function(cb) {
  cb();
}

describe('unwrap', () => {
  it('creates a Provider around the component', () => {
    const UnwrappedComp = unwrap(Fixture, store);
    const wrapper = mount(<UnwrappedComp />);

    expect(wrapper.find('Provider')).toBePresent();
  });

  it('works for state management with dependencies', () => {
    const UnwrappedComp = unwrap(Fixture, store);
    const wrapper = mount(<UnwrappedComp />);

    const compWrapper = wrapper.find('Comp')

    compWrapper.simulate('click');

    expect(compWrapper.text()).toBe('barf');
  });
});
