import React, { PropTypes } from 'react';
import crawlObject from './crawlObject';
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
    store: PropTypes.object.isRequired,
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
    const mappedStateToProps = this.props.mapStateToProps(nextContext);

    for (const key:string in mappedStateToProps) {
      if (!mappedStateToProps.hasOwnProperty(key)) {
        continue;
      }

      const mappedPath:string = mappedStateToProps[key];
      if ( updatePaths.indexOf(mappedPath) !== -1 ) {
        return true;
      }
    }

    return false;
  }

  propsForComponent() : Object {
    const { mapStateToProps } = this.props;
    const stateToProps:Object = mapStateToProps(this.context);
    const propsForComponent:Object = {};

    for (const key:string in stateToProps) {
      if (!stateToProps.hasOwnProperty(key)) {
        continue;
      }

      propsForComponent[key] = crawlObject(
        this.context.store,
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

