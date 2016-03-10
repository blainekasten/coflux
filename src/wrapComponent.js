/*
 * @flow
 */
import React from 'react';
import StatelessWrapper from './StatelessWrapper';
import HOWrapper from './HOWrapper';

// validate config - use prop types?
// memoize configs so we don't have to factory?
//  and clear them on react-route changes
export default function wrapComponent(Component:Function, config:Object):Function {
  const wrappedFunction = function(props:?Object):React.DOM {
    return (
      <HOWrapper
        {...config}
        componentProps={props}
        Component={Component}
      />
    );

    return (
      <StatelessWrapper
        {...config}
        componentProps={props}
        Component={Component}
      />
    );
  }

  wrappedFunction.nativeComponent = Component;
  wrappedFunction.displayName = Component.name;

  return wrappedFunction;
}
