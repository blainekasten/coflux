/*
 * @flow
 */
import React, { Children } from 'react';
import StatelessWrapper from './StatelessWrapper';
import CofluxContainer from './CofluxContainer';

// validate config - use prop types?
// memoize configs so we don't have to factory?
//  and clear them on react-route changes
export default function wrapComponent(Component:Function, config:Object):Function {
  Component.dependencies = config.mapStateToProps;

  /*
   * Builds an object of Component & child/grandchild Component dependencies from
   * the entire tree of children from this component down.
   */
  Component.childDependencies = function childDependencies(Component:Object, children:Array|Object) : Object {
    const deps:Object = Component.dependencies();

    let arrayChildren:Array<Object> = Children.toArray(children);

    arrayChildren.forEach(buildGranchildDependencies);

    function buildGranchildDependencies(child) : void {
      const childComponent:Object = child.type.nativeComponent;

      if (!childComponent) {
        const childChildren:Array<Object> = Children.toArray(child.props.children);
        childChildren.forEach(buildGranchildDependencies);
        return;
      }

      const grandChildDependencies:Object = childComponent.childDependencies(
        childComponent,
        child.props.children
      );

      Object.keys(grandChildDependencies).forEach(
        key => deps[key] = grandChildDependencies[key]
      );
    }

    return deps;
  };

  function wrappedFunction(props:?Object):React.DOM {
    return (
      <CofluxContainer
        {...config}
        componentProps={props}
        Component={Component}
      />
    );
  }

  wrappedFunction.nativeComponent = Component;
  wrappedFunction.displayName = `${Component.name}ContainerWrapper`;

  return wrappedFunction;
}
