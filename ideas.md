# Coflux
=======
Flux at the Component Level

# API Design goals
There is a lot of thought on what the next flux library could be. Like
all good technology, it builds off the last iteration. I'm imagining
some place combinging redux and relay. One beautiful aspect of
relay is that components define their data. I like this idea and think
it could be extended further to define actions/reducers.

It also seems that everytime I need flux, I also need react-router, and
data fetching. Why are they seperate? Then userland has to figure out
how to combine all of these heavy pieces. My goal is to make all of that
available, without the user having to figure out how to connect the
pieces.

This is some sort of ideal API:
```js
function productList(props) {
  return props.products.map(product => (
    <div>
      <div className="title">{product.title}</div>
      <div className="description">{product.description}</div>
      <button onClick={props.actions.openProduct.bind(null, product.id)}>Open</button>
      <button onClick={props.actions.deleteProduct.bind(null, product.id)}>Delete</button>
    </div>
  ));
}

export const config = {
  mapStateToProps(context) : Object {
    return {
      products: context.store.products,
    };
  },

  actions: {
    // this looks like middleware, maybe it is?
    openProduct(context, next, id) {
      context.router.push(`/route/foo/${id}`);
      // no need to call next, as react-router is taking this over?
    },

    deleteProduct(context, next, id) {
      let products = context.store.products;
      products = _.remove(products, {id});

      // causes updates to the store.
      // no need for the TYPE property as it just acts on the state.
      next({products});
    },
  },
}

export default wrap(productList, config);
```

Ironically, I've never used redux, and only seen a bit of the code. But
I think i've done a lot of the same things that Dan Abramov did. Here is
my imaginary initial file:

```jsx
import { Provider } from 'coflux';

ReactDOM.render(
  <Provider store={initialStore} />
    ...
  </Router>
  , domNode
);
```

The initialStore must have the object setup that will be expected
throughout the entire app. This we can internally infer if you are
breaking anything with Flow like checks. For example, if the intialStore
had a nested point that was of type `Object` and your component changed
it to an `Array`, we could throw an error. As that will lead to bugs.

Also, I think this library is onto something new and beautiful.
Basically no one ever has to write stateful components ever again.
Because we can protect them for having to do that logic if we are given
the data tree structure. I think with that we can do some really smart
store updates where we given ANY tree, we can know what paths will be
affected, and set the `shouldComponentUpdate` behind the scenes for
every tree.


I'd like to get to the point where initialStore is handled via a babel
transform which decides what type of primitive is used at different
paths in the store.
