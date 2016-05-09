/*
 * @flow
 */
import React from 'react';
import CofluxContainer from './CofluxContainer';

// validate config - use prop types?
// memoize configs so we don't have to factory?
//  and clear them on react-route changes
export default function wrapComponent(Component:Function, config:Object):Function {
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
