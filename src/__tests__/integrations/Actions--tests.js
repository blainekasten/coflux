jest.autoMockOff();

const React = require('react');
const {
  Provider,
  wrap,
} = require('../../index');

const { mount } = require('enzyme');
window.requestAnimationFrame = function(cb) { cb() }

describe('Actions', () => {
  const store = {
    fooString: 'bar',
    bazObject: {
      baxArray: [1,2,3],
    },
  };

  it('reduces state and updates the UI', () => {
    const nextFooValue = 'BARBAZ';

    function actionTester({foo, actions}) {
      return <div onClick={actions.updateFoo}>{foo}</div>;
    }

    const ActionTester = wrap(actionTester, {
      mapStateToProps() {
        return {
          foo: 'fooString',
        };
      },

      actions: {
        updateFoo({foo}, next) {
          next({foo: nextFooValue});
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <ActionTester />
      </Provider>
    );

    const actionWrapper = wrapper.find('actionTester');

    // prior to updating state
    expect(actionWrapper.text()).toBe('bar');

    actionWrapper.simulate('click');

    // expected after action is called
    expect(actionWrapper.text()).toBe(nextFooValue);
  });

  it('updates arrays', () => {
    function arrayUpdater({bax, actions}) {
      const baxArray = bax.map(b => <div key={b}>{b}</div>);
      return <div onClick={actions.pushNextNumber}>{baxArray}</div>;
    }

    const ArrayUpdater = wrap(arrayUpdater, {
      mapStateToProps() {
        return {
          bax: 'bazObject.baxArray',
        };
      },

      actions: {
        pushNextNumber({bax}, next) {
          bax.push(bax.length + 1);
          next({bax});
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <ArrayUpdater />
      </Provider>
    );

    const updaterWrapper = wrapper.find('arrayUpdater');

    // prior to updating state
    const priorLength = store.bazObject.baxArray.length
    expect(updaterWrapper.children().length).toBe(priorLength);

    updaterWrapper.simulate('click');

    // expected after action is called
    expect(updaterWrapper.children().length).toBe(priorLength + 1);
  });


});
