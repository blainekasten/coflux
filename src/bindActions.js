/*
 * @flow
 */
import updateState from './updateState';

export default function bindActions(
  actions:Object,
) : Object {
  const boundActions = {};

  function updateStateCallback(updateObject:Object) : any {
    return updateState(
      this.props.mapStateToProps.bind(null, this.context),
      updateObject,
      this.name(),
    );
  }

  function createBindings(action:string) : Function {
    return (...args) => {
      return actions[action](
        { ...this.propsForComponent() },
        updateStateCallback.bind(this),
        ...args,
      );
    };
  }

  for (const actionName in actions) {
    if (!actions.hasOwnProperty(actionName)) {
      continue;
    }

    boundActions[actionName] = createBindings.call(this, actionName);
  }

  return boundActions;
}
