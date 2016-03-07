/*
 * @flow
 */
import React from 'react';
import { Router } from 'react-router';
import { Component, PropTypes, Children } from 'react';
import provider from './provider';

export default class InternalRouter extends Component {

  routerRender = (props) => {
    const { component, store } = this.props;
    // will this work for every type of route?
    const Component = provider(component, store, props.routes[0].component);

    return <Component {...props} />;
  }

  render():React.DOM {
    return (
      <Router {...this.props} render={this.routerRender}>
        {this.props.children}
      </Router>
    );
  }
}
