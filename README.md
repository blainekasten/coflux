# coflux
=======
Flux at the Component Level.

Coflux was built to make your components COMPLETELY autonomous
in both appearance and data. This steals from the ideas of Relay and
Redux and brings new performance benefits previously not possible.

Coflux mitigates `shouldComponentUpdate` calls internally. So you as
the developer can focus on building UIs instead of ensuring
performance.

With coflux, there are only 2 parts you need to know:

* The initial store structure
* `wrap`ing your components.

### initialStore

We use the `<Provider />` idea from Redux to create a single store. But
instead of having reducers spread all over your code, they live next
to your components. We'll get to that in a minute. Our `Provider`
wants to know the structure of your store and any default data. So it
takes an argument of `initialStore` which gets copied to set that. 

> **NOTE**
> Our goal is to make the initialStore inferred through a babel
> compiler. That will help with additional performance gains and reduce
> developer work.

```js
import { Provider } from 'coflux';

render(
  <Provider initialStore={{
    groceryBag: { items: [], total: 0 },
    user: { firstName: null, lastName: null, id: null }
  }}>
    ...
  </Provider>
)
```

Once your initial store is set, you can build your components
and wrap them.

### wrap

Wrapping a component lets the component know about it's store and
infer all the goodies that this library was built for. wrapping
uses a similar API to redux but re-orients the reducer pattern to
live next to the component. Here is a simple example:


```js
import { wrap } from 'coflux';

function GroceryBag({items, total, actions}) {
  return (
    <div>
      {items.map((item, i) =>
        <li onClick={() => actions.delete(i)}>{item}</li>
      )}
      TOTAL: {total}
      <button onClick={actions.checkout}>Checkout</button>
    </div>
  );
}

export default wrap(GroceryBag, {
  mapStateToProps() {
    items: 'groceryBag.items',
    total: 'groceryBag.total',
  },

  actions: {
    checkout(props, next) {
      // checkout code
    }

    delete(props, next, index) {
      const items = props.items;
      items = items.splice(index, 1);

      next({items}); // updates the internal store
    }
});
```

That example shows items from your store being mapped into your
components props and creating action reducers local to your component.



### EXTRAS

#### mapped props with `_`

Internally, we use these mapped props to track updates and prevent
component re-renders. So every store property you bind to, you are
effectively asking for re-renders when that changs. Sometimes
you only want to read from a property, and getting a re-render is
pointless. Currently you can get a perf gain by prefixing with an `_`
in those situations.

> **NOTE**
> Future, this will be managed behind the scenes through the babel transform.

```js
wrap(Component, {
  mapStateToProps() {
    return {
      foo: 'foo',
      _bar: 'bar', // Component will not re-render when this changes
    }
  }
});


#### Testing Helper

`unwrap` (Currently called something else) will help you test your
components by sorting out the internal needs for the component and
letting you set those values.
