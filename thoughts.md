Talking with @developerdizzle we talked about middlewares and the
general ideas. Here are some thoughts as a take away.

#### Middleware might be needed
2 Legimiate cases for middleware are:
* history (undo/redo)
* logging

###### History
History I think we could internally handle quite well.

Proposed API:

```js
function foo({actions}) {
  return <input onClick={actions.handleClick.undoable} /> // undoable being the key here
}

wrap(foo, { actions: {
  handleClick() {
    // does something
  }
}});
```


Other API, This might be better because its in the actions. Where a devs
eyes would look for action logic.

```js
function foo({actions}) {
  return <input onClick={actions.handleClick} />
}

wrap(foo, { actions: {
  handleClick(boundState, next) {
    // does something
    boundState.foo = true;

    next(boundState, 'undoable');
  }
}});
```

###### Logging
Logging gets so dynamic. I don't think we can standarize that... So we
might need to open up some middle-ware there. The other option is that
they put logging into their actions a la carte.

Decorators could help reduce dulpicated code..
