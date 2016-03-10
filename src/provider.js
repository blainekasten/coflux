/*
 * @flow
 */
import React, { PropTypes } from 'react';
import { listen } from './listener';
import { injectStore } from './Store';

export default function provider(Component, store, children) {
  return class Provider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        store,
        updatePaths: [],
      };

      injectStore(store);
      listen((storeUpdate, updatePaths) => this.setState({updatePaths, store: storeUpdate}));
    }

    static childContextTypes = {
      params: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    getChildContext():Object {
      const { params, router } = this.props;
      const { store, updatePaths } = this.state;
      return {
        params,
        router,
        store,
        updatePaths,
      }
    }

    render() {
      return (
        <Component>
          {children()}
        </Component>
      );
    }
  }
}
