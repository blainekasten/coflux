/*
 * @flow
 */
import updateState from './updateState';

export default function bindActions(
  actions:Object,
  { mapStateToProps },
  context:Object,
  propsForComponent:Object,
) : Object {
  const boundActions = {};

  function updateStateCallback(updateObject:Object) : void {
    updateState(
      mapStateToProps.bind(null, context),
      updateObject
    );
  }

  for (const actionName in actions) {
    boundActions[actionName] = actions[actionName].bind(
      null,
      { ...propsForComponent,
        router: context.router
      },
      updateStateCallback
    );
  }

  return boundActions;
}
