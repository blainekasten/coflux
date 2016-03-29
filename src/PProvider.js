/*
 * @flow
 */
import React, { PropTypes, Children } from 'react';
import { listen } from './listener';
import { injectStore } from './Store';

export default class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    store: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props) {
    super(props);

    injectStore(this.props.store);

    this.state = {
      store: {...this.props.store},
      updatePaths: [],
    };

    listen((storeUpdate, updatePaths) => {
      this.setState({updatePaths, store: storeUpdate});
    });
  }

  getChildContext():Object {
    const { store, updatePaths } = this.state;

    return {
      store,
      updatePaths,
    };
  }

  render() : React.DOM {
    const { children } = this.props;
    return Children.only(children);
  }
}
