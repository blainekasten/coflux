import React, { PropTypes } from 'react';
import { store as state, loadedForPath } from './Store';
import crawlObject from './crawlObject';
import bindActions from './bindActions';
import updateState from './updateState';

// bind actions correctly
export default class HOWrapper extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    updatePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  state = {
    loading: false,
  }

  constructor(props, context) : void {
    super(props, context);

    const { actions, propsForComponent } = props;
    this.boundActions = actions;
    this.propsForComponent = {};

    this.buildPropsForComponent();

    if (actions && !actions._bound) {
      this.boundActions = bindActions.call(this, actions);
      actions._bound = true;
    }
  }

  /*
   * This is the engine behind 'data driven escape renders'
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { updatePaths } = nextContext;
    const mappedStateToProps = this.props.mapStateToProps();

    for (const key:string in mappedStateToProps) {
      const mappedPath:string = mappedStateToProps[key];
      if ( updatePaths.indexOf(mappedPath) !== -1 ) {
        return true;
      }
    }

    return false;
  }

  componentWillUpdate() {
    this.buildPropsForComponent(true);
    console.log('Updating', this.props.Component.name);
  }

  buildPropsForComponent(useSetState:?boolean) {
    const { mapStateToProps, fetch } = this.props;
    const stateToProps:Object = mapStateToProps();

    for (const key:string in stateToProps) {
      // TODO  figure out when to fetch and when to not fetch
      // maybe something like on initial load check the store to see if it was provided
      // initially?
      this.propsForComponent[key] = crawlObject(this.context.store, stateToProps[key]);

      const propValue:any = this.propsForComponent[key];

      // TODO
      if (!propValue || (Array.isArray(propValue) && !propValue.length)) {
        fetch(this.context).then(data => {
          loadedForPath(key);
          updateState(
            mapStateToProps.bind(null, this.context),
            data
          );
          this.setState({loading: false});
        });

        if (useSetState) {
          this.setState({loading: true });
        } else {
          this.state.loading = true;
        }
      }
    }
  }


  render() {
    const {
      Component,
      componentProps,
      loadingDOM,
    } = this.props;

    if (this.state.loading) {
      return loadingDOM ? <loadingDOM /> : null;
    }


    /*
     * multiple re-renders might cause things to be rebound
     */
    return (
      <Component {...componentProps} {...this.propsForComponent} actions={this.boundActions} />
    );
  }
}

