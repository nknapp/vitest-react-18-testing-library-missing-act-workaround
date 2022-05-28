## Update: The workaround is not required anymore for `vitest >= 0.12.6`

# Why?

I was trying to run tests using React 18, `@testing-library/react` and `vitest`
and got the warning.

> Warning: An update to App inside a test was not wrapped in act(...).
> ...

This warning is usually printed, whenever a component updates and the control
flow is not either inside an `act()` call, but when using `@testing-library`-or a `waitFor()` call.

With `vitest` and React 18, this warning was printed, even though the code
was clearly within `waitFor()`. I added a lot of `console.log`-statements in
`node_modules` files to make sure of that.

So here is what happens:

In the `react-dom/test-utils`, when the global variable `IS_REACT_ACT_ENVIRONMENT` is set to true, the `act()`-check is enabled.
In that case, when a state-transition happens outside an `act()`-call, the warning is printed.

More about this can be read here: https://github.com/reactwg/react-18/discussions/102

The [waitFor](https://github.com/testing-library/dom-testing-library/blob/11fc7731e5081fd0994bf2da84d688fdb592eda7/src/wait-for.js#L190-L197)
is wrapped with an [asyncWrapper](https://github.com/testing-library/react-testing-library/blob/c8c93f83228a68a270583c139972e79b1812b7d3/src/pure.js#L22-L30)
that temporarily sets the global variable [IS_REACT_ACT_ENVIRONMENT](https://github.com/testing-library/react-testing-library/blob/c8c93f83228a68a270583c139972e79b1812b7d3/src/act-compat.js#L23)
to `false`. No warning is printed for this time when the code runs inside a `waitFor`.

## Why is the warning printed in `vitest`?

Apparently, there are two global objects in. In may case, when `waitFor` set the `IS_REACT_ACT_ENVIRONMENT` variable to `false`,
it used [self](https://github.com/testing-library/react-testing-library/blob/c8c93f83228a68a270583c139972e79b1812b7d3/src/act-compat.js#L7).
With `vitest`, this seems *not to be* the same als `globalThis`, which is accessed when React tries to figure out whether to show
the warning of not [(see here)](https://github.com/facebook/react/blob/d5b6b4b865ebf13a1eaf2342d623101056e5e197/packages/react-reconciler/src/ReactFiberAct.old.js#L44)

When using `jest`, it seems to be the same object, because there is no warning.

## Workaround

My workaround is to define the `IS_REACT_ACT_ENVIRONMENT` property in [`vitest`'s setup method](src/setupVitest.js) in such a way
that any access is delegated to the same property on the `self`-object.

```js
Object.defineProperty(globalThis,"IS_REACT_ACT_ENVIRONMENT", {
  get() {
    if (typeof globalThis.self !== 'undefined') {
      return globalThis.self.IS_REACT_ACT_ENVIRONMENT
    }
  },
  set(value) {
    if (typeof globalThis.self !== 'undefined') {
      globalThis.self.IS_REACT_ACT_ENVIRONMENT = value
    }
  }
})

globalThis.IS_REACT_ACT_ENVIRONMENT = true
```

## Reproducing the issue

* Run tests with jest `yarn test`: No warning is displayed
* Run tests with vitest `yarn vitest`: The warning is display
* Workaround: Remove the comments in front of the workaround code in [src/setupVitest.js](src/setupVitest.js)
  and run `yarn vitest` again: No warning is displayed.

