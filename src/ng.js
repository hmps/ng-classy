
/**
 * We just have one angular module that include all others.
 */
export const App = angular.module('App', [
  'ui.router'
]);

function pascalCaseToCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}
function camelCaseToDashCase(str) {
  return str.replace(/[A-Z]/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}

export function Service(name) {
  return function(Class) {
    App.service(name, Class);
  };
}

export function Component(options) {
  return function(Class) {
    let directiveName = pascalCaseToCamelCase(Class.name);
    Class.$component = directiveName;
    App.directive(directiveName, () => {
      let o =  angular.merge({
        restrict: 'E',
        scope: {},
        bindToController: {},
        controllerAs: 'ctrl',
        controller: Class
      }, options || {});
      console.log(directiveName, o);
      return o;
    });
  };
}

export function State(stateName, options) {
  return function(Class) {
    let directiveName = Class.$component;
    if (!directiveName) {
      throw new Error("@Route must be called after @Component");
    }
    let urlParams = (options.url.match(/:.*?(\/|$)/g) || []).map((match) => {
      return match.replace(/\/$/, '').replace(/^:/,'');
    });

    App.config(($stateProvider) => {
      let htmlName = camelCaseToDashCase(directiveName);
      // <my-directive param-one="$stateParams['paramOne']" param-two="$stateParams['paramTwo']">
      let attrValuePairs = `${urlParams.map(param => `${camelCaseToDashCase(param)}="$stateParams['${param}']"`).join(' ')}`;
      let template = `<${htmlName} ${attrValuePairs}>`;

      $stateProvider.state(stateName, angular.merge({
        controller: function($stateParams, $scope) {
          $scope.$stateParams = $stateParams;
        },
        template: template
      }, options));
    });

  };
}
