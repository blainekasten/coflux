import React, { PropTypes } from 'react';
import crawlObject from 'object-crawl';
import bindActions from './bindActions';

// bind actions correctly
export default class CofluxContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    propsForComponent: PropTypes.object,
    mapStateToProps: PropTypes.func,
    Component: PropTypes.func,
    componentProps: PropTypes.object,
  };

  static contextTypes = {
    state: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props, context) : void {
    super(props, context);

    const { actions } = props;
    this.boundActions = bindActions.call(this, actions);
  }

  /*
   * This is the engine behind 'data driven escape renders'
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { updatePaths } = nextContext;
    const mappedStateToProps = this.props.mapStateToProps(nextContext.state);

    // don't compare on prefixed private variables
    Object.keys(mappedStateToProps).forEach(key => {
      if (key[0] === '_') {
        delete mappedStateToProps[key];
      }
    });

    for (const key:string in mappedStateToProps) {
      if (!mappedStateToProps.hasOwnProperty(key)) {
        continue;
      }

      const mappedPath:string = mappedStateToProps[key];
      if ( updatePaths.indexOf(mappedPath) !== -1 ) {
        console.log('UPDATING NODE', this.name());
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

    console.log(propsForComponent);
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

