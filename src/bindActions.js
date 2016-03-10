/*
 * @flow
 */
import updateState from './updateState';

export default function bindActions(
  actions:Object,
) : Object {
  const boundActions = {};

  function updateStateCallback(updateObject:Object) : void {
    updateState(
      this.props.mapStateToProps.bind(null, this.context),
      updateObject
    );
  }

  for (const actionName in actions) {
    boundActions[actionName] = (...args) => {
      actions[actionName](
        { ...this.propsForComponent,
          router: this.context.router
        },
        updateStateCallback.bind(this),
        ...args,
      );
    };
  }

  return boundActions;
}
