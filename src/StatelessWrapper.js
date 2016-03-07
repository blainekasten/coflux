import React, { PropTypes } from 'react';
import { store as state, loadedForPath } from './Store';
import crawlObject from './crawlObject';
import bindActions from './bindActions';
import updateState from './updateState';

// bind actions correctly
export default function StatelessWrapper(props, context):React.DOM {
  const {
    fetch,
    Component,
    componentProps,
    actions,
    loadingDOM,
    mapStateToProps,
  } = props;

  const stateToProps = mapStateToProps(context);
  const propsForComponent = {};
  let boundActions = actions;

  for (const key in stateToProps) {
    if (state.__loadedPathsMap[key]) {
      propsForComponent[key] = crawlObject(context.store, stateToProps[key]);
      continue;
    }

    // TODO
    fetch(context).then(data => {
      loadedForPath(key);
      updateState(
        mapStateToProps.bind(null, context),
        data
      );
    });
    return loadingDOM();
  }

  /*
   * multiple re-renders might cause things to be rebound
   */
  if (!actions._bound) {
    boundActions = bindActions(actions, props, context, propsForComponent);
    actions._bound = true;
  }

  return (
    <Component {...componentProps} {...propsForComponent} actions={boundActions} />
  );
}

StatelessWrapper.contextTypes = {
  store: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
}
