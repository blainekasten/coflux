/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule bindActions
 * @flow
 */

import React, { PropTypes } from 'react';
import crawlObject from 'object-crawl';
import bindActions from './bindActions';
import type { ActionBindings } from './bindActions';

type Props = {
  actions:Object,
  mapStateToProps:Function,
  Component:Function,
  componentProps:Object
};

type Context = {
  state: Object,
  updatePaths: Array<string>,
};


// bind actions correctly
export default class CofluxContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    mapStateToProps: PropTypes.func,
    Component: PropTypes.func,
    componentProps: PropTypes.object,
  };

  static contextTypes = {
    state: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  boundActions:ActionBindings;

  constructor(props:Props, context:Context) : void {
    super(props, context);

    const { actions } = props;
    this.boundActions = bindActions.call(this, actions);
  }

  /*
   * This is the engine behind 'data driven escape renders'
   */
  shouldComponentUpdate(
    nextProps:Props,
    nextState:void,
    nextContext:Context,
  ) : boolean {
    const { updatePaths } = nextContext;
    const { children } = this.props.componentProps;
    const treeDependencies = this.props.Component.childDependencies(this.props.Component, children);

    // don't compare on prefixed private variables
    Object.keys(treeDependencies).forEach(key => {
      if (key[0] === '_') {
        delete treeDependencies[key];
      }
    });

    for (const key:string in treeDependencies) {
      if (!treeDependencies.hasOwnProperty(key)) {
        continue;
      }

      const mappedPath:string = treeDependencies[key];
      if (updatePaths.indexOf(mappedPath) !== -1) {
        return true;
      }
    }

    return false;
  }

  name() : string {
    const { Component } = this.props;
    return Component.displayName || Component.name || 'UnnamedComponent';
  }

  propsForComponent() : Object {
    const { mapStateToProps } = this.props;
    const stateToProps:Object = mapStateToProps(this.context.state);
    const propsForComponent:Object = {};

    for (const key:string in stateToProps) {
      if (!stateToProps.hasOwnProperty(key)) {
        continue;
      }

      propsForComponent[key] = crawlObject(
        this.context.state,
        stateToProps[key]
      );
    }

    return propsForComponent;
  }


  render() : React.DOM {
    const {
      Component,
      componentProps,
    } = this.props;

    /*
     * multiple re-renders might cause things to be rebound
     */
    return (
      <Component {...componentProps} {...this.propsForComponent()} actions={this.boundActions} />
    );
  }
}
