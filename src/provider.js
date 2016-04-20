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
  };

  static childContextTypes = {
    state: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);

    const state = injectStore(this.props.store);

    this.state = {
      state,
      updatePaths: [],
    };

    listen((storeUpdate, updatePaths) => {
      this.setState({updatePaths, store: storeUpdate});
    });
  }

  getChildContext():Object {
    const { state, updatePaths } = this.state;

    return {
      state,
      updatePaths,
    };
  }

  render() : React.DOM {
    const { children } = this.props;
    return Children.only(children);
  }
}
