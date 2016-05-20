/*
 * Integration for props that are prefixed
 * with `_`. That should not re-update a tree
 */


jest.autoMockOff();

const React = require('react');
const {
  Provider,
  wrap,
} = require('../../index');

const { mount } = require('enzyme');
window.requestAnimationFrame = function(cb) { cb() }

describe('WriteOnlyProps', () => {
  it('ComponentAction - should not re-render when a write-only prop is updated', () => {
    const store = {
      foo: true,
    };

    class Comp extends React.Component {
      render() {
        return <div onClick={this.props.actions.updateFoo}/>;
      }
    }


    Comp.prototype.componentWillUpdate = jest.genMockFunction();

    const WrappedComp = wrap(Comp, {
      mapStateToProps() {
        return {
          _foo: 'foo',
        };
      },

      actions: {
        updateFoo(state, next) {
          next({_foo: false});
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <WrappedComp />
      </Provider>
    );

    // trigger state update
    wrapper.find('[onClick]').simulate('click');

    //expect(store.foo).toBeFalsy();
    expect(Comp.prototype.componentWillUpdate).not.toBeCalled();
  });


  it('SiblingAction - should not re-render when a write-only prop is updated', () => {
    const store = {
      foo: true,
    };

    class Comp extends React.Component {
      render() {
        return <div onClick={this.props.actions.updateFoo}/>;
      }
    }
    Comp.prototype.componentWillUpdate = jest.genMockFunction();

    const WrappedComp = wrap(Comp, {
      mapStateToProps() {
        return {
          _foo: 'foo',
        };
      },
    });

    class Sibling extends React.Component {
      render() {
        return (
          <div onClick={this.props.actions.updateFoo}>
            {this.props.foo}
          </div>
        );
      }
    }

    Sibling.prototype.componentWillUpdate = jest.genMockFunction();

    const WrappedSibling = wrap(Sibling, {
      mapStateToProps() {
        return {
          foo: 'foo',
        };
      },

      actions: {
        updateFoo(state, next) {
          next({foo: false});
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <div>
          <WrappedComp />
          <WrappedSibling />
        </div>
      </Provider>
    );

    // trigger state update
    wrapper.find('[onClick]').simulate('click');

    //expect(store.foo).toBeFalsy();
    expect(Comp.prototype.componentWillUpdate).not.toBeCalled();
    expect(Sibling.prototype.componentWillUpdate).toBeCalled();
  });


  it('GrandparentAction - should not re-render when a write-only prop is updated', () => {
    const store = {
      foo: true,
    };

    class Comp extends React.Component {
      render() {
        return <div onClick={this.props.actions.updateFoo}/>;
      }
    }
    Comp.prototype.componentWillUpdate = jest.genMockFunction();

    const WrappedComp = wrap(Comp, {
      mapStateToProps() {
        return {
          _foo: 'foo',
        };
      },
    });

    class Parent extends React.Component {
      render() {
        return (
          <div onClick={this.props.actions.updateFoo}>
            {this.props.foo}
          </div>
        );
      }
    }

    Parent.prototype.componentWillUpdate = jest.genMockFunction();

    const WrappedParent = wrap(Parent, {
      mapStateToProps() {
        return {
          foo: 'foo',
        };
      },

      actions: {
        updateFoo(state, next) {
          next({foo: false});
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <WrappedParent>
          <WrappedComp />
        </WrappedParent>
      </Provider>
    );

    // trigger state update
    wrapper.find('[onClick]').simulate('click');

    //expect(store.foo).toBeFalsy();
    expect(Comp.prototype.componentWillUpdate).not.toBeCalled();
    expect(Parent.prototype.componentWillUpdate).toBeCalled();
  });
});
