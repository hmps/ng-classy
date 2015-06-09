# ng-classy

```
npm install ng-classy
```

- Warning: this module is extremely opinionated. That's why it's useful.
- Scroll down for API docs.

### Purpose

Use ES6 classes. Ditch angular 1's modules.

This is the best angular 1 + ES6 pattern you can find, but it's full of boilerplate:

```js
//These all `export default` angular modules
import directiveOneModule from '../directive-one';
import directiveTwoModule from '../directive-two';
import serviceOneModule from '../service-one';

//Define angular dependencies. This is pure boilerplate.
export default angular.module('myComponent', [
  directiveOneModule.name,
  directiveTwoModule.name,
  serviceOneModule.name,
])
  // Make a state that maps to our component in a decoupled manner, so our component is reusable outside the state.
  // Much boilerplate.
  .config(($stateProvider) => {
    $stateProvider.state('myComponentState', {
      url: 'url/:param',
      template: '<my-component param="$stateParams.param">',
      controller: ($stateParams, $scope) => $scope.$stateParams = $stateParams
    })
  })
  // Declare a component.
  // Much boilerplate.
  .directive('myComponent', () => {
    return {
      restrict: 'E',
      scope: {},
      template: 'my template with a {{vm.param}} binding.'
      bindToController: {
        param: '='
      }
      controllerAs: 'vm',
      controller: MyComponent
    };
  });

// Finally, we can actually implement our component.
class MyComponent {
}
```

Let's fix this situation.

We don't care about angular module dependencies. ES6 handles dependencies for us.

Let's just make everything that's imported be put onto one global angular module. This makes it so only what we explicitly load via ES6 imports is loaded by angular, so we're still test-friendly.

Also, it's very common that we want a state with some parameters to map to a component with attribute bindings. So let's make that really easy.

```js
// Importing these causes them to implicitly be defined as dependencies on our angular module.
import {serviceOne} from '../service-one';
import {serviceTwo} from '../service-two';
import {directiveOne} from '../directive-one';
import {Component, State} from 'ng-classy';

@Component({
  bind: {
    param: '='
  },
  template: 'my template with a {{vm.param}} binding.'
})
@State('myComponentState', {
  url: 'url/:param'
})
export class MyComponent {
  // Creates a <my-component> element directive, using the class as a controller and `controllerAs: 'vm'`

  // Additionally creates a state whose template is '<my-component param="$stateParams.param"></my-component>'.
}
```

Goodbye, boilterplate. Hello, ease.

### Development

- `npm install`
- `npm test`
- `npm run test-watch`

### API

You'll understand all of this if you understand ES6 imports and ES6 decorators. Use Google if you don't.

```js
import classy from 'ng-classy';

/*
 * # classy.app
 * The angular module instance that your whole app shares.
 * Use it for things like angular config, constants, etc: `classy.app.config(() => {})`
 */
classy.app;

/*
 * # @Classy.service()
 * Registers 'MyService' as an injectable service on your app.
 */
@classy.Service()
class MyService {
}

/*
 * # @classy.Component(options)
 * Registers `<my-component>` as an element directive.
 * Pass in options that map to a directive definition object.
 * Has a shortcut field, `bind`, that maps to `bindToController`.
 * `options` defaults to the following in this case:
 *  {
 *    restrict: 'E',
 *    scope: {},
 *    bindToController: options.bind || {},
 *    controllerAs: 'vm',
 *    controller: MyComponent
 *  }
 */
@classy.Component({
  bind: {
   color: '='
  },
  template: 'some template with a binding to color {{vm.color}}' 
 })
class MyComponent {
}

/*
 * # @classy.State(name, options)
 * Must be called after `@classy.Component()` on a class.
 * Registers a new state with the the given name and state options.
 * The template will default to instantiating the given component with the url parameters as attributes.
 * See the example at the beginning of the README.
 */
@classy.Component({
 bind: {
   someParam: '='
   },
   template: 'we have a parameter, {{vm.someParam}}'
 }
})
@classy.State('myState', {
  url: 'url/:someParam'
})
class SomeComponent {
}
```
