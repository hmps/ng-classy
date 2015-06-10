
/*
 It's written in ES5 to be used in ES6.
 Funny, I know, but consuming modules written in ES6 just isn't easy yet.
 */

/*
 NOTE: we expect angular on the window here. this is technically sinful, but in practice it vars you load
 angular from a CDN, which is almost always the correct option.
*/

/**
 * We just have one angular module that include all others.
 */
var app = module.exports.app = angular.module('ngClassyApp', [
  'ui.router'
]);

module.exports.Service = function Service() {
  return function(Class) {
    app.service(Class.name, Class);
  };
};

module.exports.Component = function Component(options) {
  return function(Class) {
    options.bindToController = options.bindToController || options.bind || {};
    var directiveName = pascalCaseToCamelCase(Class.name);
    app.directive(directiveName, function() {
      return angular.merge({
        restrict: 'E',
        scope: {},
        bindToController: {},
        controllerAs: 'vm',
        controller: Class
      }, options || {});
    });

    if (Class.$initState) {
      Class.$initState(directiveName);
    }

    Class.$isComponent = true;
  };
};

module.exports.State = function State(stateName, options) {
  return function(Class) {
    if (Class.$isComponent) {
      throw new Error("@State() must be placed after @Component()!");
    }
    Class.$initState = function(directiveName) {
      var urlParams = (options.url.match(/:.*?(\/|$)/g) || []).map(function(match) {
        return match.replace(/\/$/, '').replace(/^:/,'');
      });

      app.config(function($stateProvider) {
        var htmlName = camelCaseToDashCase(directiveName);
        // <my-directive param-one="$stateParams['paramOne']" param-two="$stateParams['paramTwo']">
        var attrValuePairs = urlParams.map(function(param) {
          return camelCaseToDashCase(param) + '="__$stateParams[\'' + param + '\']"';
        }).join(' ');
        var template = '<' + htmlName + ' ' + attrValuePairs + '>';

        $stateProvider.state(stateName, angular.merge({
          controller: function($stateParams, $scope) {
            $scope.__$stateParams = $stateParams;
          },
          template: template
        }, options));
      });
    };

  };
};

// Dumb helpers
function pascalCaseToCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}
function camelCaseToDashCase(str) {
  return str.replace(/[A-Z]/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}
