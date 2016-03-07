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
      };

      injectStore(store);
      listen(storeUpdate => this.setState({store: storeUpdate}));
    }

    shouldComponentUpdate() {
      console.log('updating');
      return true;
    }

    static childContextTypes = {
      params: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    }

    getChildContext():Object {
      const { params, router, store } = this.props;
      return {
        params,
        router,
        store,
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
