/*
 * @flow
 */
import React, { PropTypes } from 'react';
import { listen } from './listener';
import { store } from './Store';

export default function provider(AppRoot) {
  return class Provider extends React.Component {
    static childContextTypes = {
      params: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    constructor(props) {
      super(props);

      this.state = {
        store,
        updatePaths: [],
      };

      listen((storeUpdate, updatePaths) => {
        this.setState({updatePaths, store: storeUpdate})
      });
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
      const RouteComponent = this.props.components[0];
      return (
        <AppRoot>
          <RouteComponent />
        </AppRoot>
      );
    }
  }
}
