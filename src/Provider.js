/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule Provider
 * @flow
 */

import React, { PropTypes, Children } from 'react';
import Listener from './listener';
import Store from './Store';
import DevTools from './DevTools';

type Props = {
  children: Array<React.DOM> | React.DOM,
  store: Object,
};

type State = {
  applicationState: Object,
  updatePaths: Array<string>,
};

type Context = {
  state: Object,
  updatePaths: Array<string>,
};

export default class Provider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    state: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props:Props) {
    super(props);

    this.state.applicationState = Store.injectStore(this.props.store);

    Listener.listen(
      (applicationState, updatePaths) => this.setState({ applicationState, updatePaths })
    );
  }

  componentWillMount() {
    DevTools.connect(this.state.applicationState);
  }

  componentWillUnmount = DevTools.disconnect;

  state:State = {
    applicationState: {},
    updatePaths: [],
  };

  getChildContext() : Context {
    const { applicationState, updatePaths } = this.state;

    return {
      state: applicationState,
      updatePaths,
    };
  }

  render() : React.DOM {
    const { children } = this.props;
    return Children.only(children);
  }
}
