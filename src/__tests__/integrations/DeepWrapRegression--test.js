jest.autoMockOff();

const React = require('react');
const {
  Provider,
  wrap,
} = require('../../index');

const { mount } = require('enzyme');
window.requestAnimationFrame = function(cb) { cb() }

describe('Deep Wrap', () => {
  const EXPECTED_STATE_VALUE = 'blahblah';
  /*
   * Coflux needs to maintain `shouldComponentUpdate` for
   * deeply `wrap`ed trees.
   */
  it('regression #11', () => {
    const parentNode = function({parent, children}) {
      return (
        <div>
          {parent}
          {children}
        </div>
      );
    };

    const childA = function({a}) {
      return <div>{a}</div>;
    };

    const childB = function({b, actions}) {
      return <div onClick={actions.b}>{b}</div>;
    };

    const Parent = wrap(parentNode, {
      mapStateToProps() {
        return {
          parent: 'parent',
        };
      }
    });

    const A = wrap(childA, {
      mapStateToProps() {
        return {
          a: 'a',
        };
      }
    });

    const B = wrap(childB, {
      mapStateToProps() {
        return {
          b: 'b',
        };
      },

      /*
       * action is deeply nested so this
       * SHOULD properly trigger an update
       * AND `childB` should get updated
       */
      actions: {
        b({b}, next) {
          next({b: EXPECTED_STATE_VALUE});
        },
      },
    });
    const store = {
      parent: 'foo',
      a: 'bar',
      b: 'baz',
    };

    const tree = mount(
      <Provider store={store}>
        <Parent>
          <A />
          <B />
        </Parent>
      </Provider>
    );

    /*
     * simulate the click to update state
     */
    const bWrapper = tree.find('[onClick]');
    bWrapper.simulate('click');

    /*
     * EXPECTATION
     */
    expect(
      bWrapper.text()
    ).toBe(EXPECTED_STATE_VALUE);

  });

  it('works with deeply nested issues', () => {
    const parentNode = function({parent, children}) {
      return (
        <div>
          {parent}
          {children}
        </div>
      );
    };

    const childA = function({a, children}) {
      return (
        <div>
          {a}
          {children}
        </div>
      );
    };

    const childB = function({b, actions}) {
      return <div onClick={actions.b}>{b}</div>;
    };

    const Parent = wrap(parentNode, {
      mapStateToProps() {
        return {
          parent: 'parent',
        };
      }
    });

    const A = wrap(childA, {
      mapStateToProps() {
        return {
          a: 'a',
        };
      }
    });

    const B = wrap(childB, {
      mapStateToProps() {
        return {
          b: 'b',
        };
      },

      /*
       * action is deeply nested so this
       * SHOULD properly trigger an update
       * AND `childB` should get updated
       */
      actions: {
        b({b}, next) {
          next({b: EXPECTED_STATE_VALUE});
        },
      },
    });
    const store = {
      parent: 'foo',
      a: 'bar',
      b: 'baz',
    };

    const tree = mount(
      <Provider store={store}>
        <Parent>
          <A>
            <B />
          </A>
        </Parent>
      </Provider>
    );

    /*
     * simulate the click to update state
     */
    const bWrapper = tree.find('[onClick]');
    bWrapper.simulate('click');

    /*
     * EXPECTATION
     */
    expect(
      bWrapper.text()
    ).toBe(EXPECTED_STATE_VALUE);

  });


  it('works with intersparsed non-coflux nodes', () => {
    const parentNode = function({parent, children}) {
      return (
        <div>
          {parent}
          {children}
        </div>
      );
    };

    const childB = function({b, actions}) {
      return <div onClick={actions.b}>{b}</div>;
    };

    const Parent = wrap(parentNode, {
      mapStateToProps() {
        return {
          parent: 'parent',
        };
      }
    });

    const A = function({children}) {
      return (
        <div>
          {children}
        </div>
      );
    };


    const B = wrap(childB, {
      mapStateToProps() {
        return {
          b: 'b',
        };
      },

      /*
       * action is deeply nested so this
       * SHOULD properly trigger an update
       * AND `childB` should get updated
       */
      actions: {
        b({b}, next) {
          next({b: EXPECTED_STATE_VALUE});
        },
      },
    });
    const store = {
      parent: 'foo',
      a: 'bar',
      b: 'baz',
    };

    const tree = mount(
      <Provider store={store}>
        <Parent>
          <A>
            <B />
          </A>
        </Parent>
      </Provider>
    );

    /*
     * simulate the click to update state
     */
    const bWrapper = tree.find('[onClick]');
    bWrapper.simulate('click');

    /*
     * EXPECTATION
     */
    expect(
      bWrapper.text()
    ).toBe(EXPECTED_STATE_VALUE);

  });

  it('works with intersparsed non-coflux nodes LARGE TREE', () => {
    const parentNode = function({parent, children}) {
      return (
        <div>
          {parent}
          {children}
        </div>
      );
    };

    const childB = function({b, actions}) {
      return <div onClick={actions.b}>{b}</div>;
    };

    const Parent = wrap(parentNode, {
      mapStateToProps() {
        return {
          parent: 'parent',
        };
      }
    });

    const A = function({children}) {
      return (
        <div>
          {children}
        </div>
      );
    };


    const B = wrap(childB, {
      mapStateToProps() {
        return {
          b: 'b',
        };
      },

      /*
       * action is deeply nested so this
       * SHOULD properly trigger an update
       * AND `childB` should get updated
       */
      actions: {
        b({b}, next) {
          next({b: EXPECTED_STATE_VALUE});
        },
      },
    });
    const store = {
      parent: 'foo',
      a: 'bar',
      b: 'baz',
    };

    const tree = mount(
      <Provider store={store}>
        <Parent>
          <span>
            <A/>
          </span>
          <div>
            <A>
              <B />
            </A>
          </div>
        </Parent>
      </Provider>
    );

    /*
     * simulate the click to update state
     */
    const bWrapper = tree.find('[onClick]');
    bWrapper.simulate('click');

    /*
     * EXPECTATION
     */
    expect(
      bWrapper.text()
    ).toBe(EXPECTED_STATE_VALUE);

  });

  it('works with non-element children', () => {
    const nodeWithTextChild = ({ test, children, actions }) => {
      return (
        <div onClick={actions.triggerUpdate}>
          {test} {children}
        </div>
      );
    };

    const NodeWithTextChild = wrap(nodeWithTextChild, {
      mapStateToProps() {
        return {
          test: 'test',
        };
      },
      actions: {
        triggerUpdate(props, next) {
          next({ test: 'bar' });
        },
      },
    });

    const store = {
      test: 'foo',
    };

    const tree = mount(
      <Provider store={store}>
        <NodeWithTextChild>
          test
        </NodeWithTextChild>
      </Provider>
    );

    /*
     * simulate the click to update state
     */
    const nodeWrapper = tree.find('[onClick]');
    nodeWrapper.simulate('click');

    /*
     * EXPECTATION
     */
    expect(
      nodeWrapper.text()
    ).toBe('bar test');
  });
});
