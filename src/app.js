import {Component, State} from './ng';

@Component({
  template: `
    <div>hello, {{ctrl.foo}}</div>
    <a ui-sref="child({ name: 'first', thisOneIsLong: 'second' })">Go to Child</a>
    <ui-view></ui-view>
  `
})
class SuperCmp {
  constructor($rootScope) {
    this.foo = 'bar';
  }
}

@State('child', {
  url: '/child/:name/:thisOneIsLong'
})
@Component({
  template: `<div>I'm a child. name = {{ctrl.name}}, thisOneIsLong = {{ctrl.thisOneIsLong}}</div>`,
  bindToController: {
    name: '=',
    thisOneIsLong: '='
  }
})
class ChildCmp{
}
