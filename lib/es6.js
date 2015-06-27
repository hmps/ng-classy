/**
 * NG CLASSY
 */
import angular from 'angular';
import 'angular-ui-router';
import {
    pascalCaseToCamelCase, camelCaseToDashCase
}
from './helpers';

/**
 * We just have one angular module that include all others.
 */
export var app = angular.module('ngClassyApp', [
    'ui.router'
]);


/**
 * [service description]
 * @return {[type]} [description]
 */
export function service() {
    return (Class) => {
        app.service(Class.name, Class);
    };
}



/**
 * [Inject description]
 */
export function inject() {
    var injectables = Array.prototype.slice.call(arguments);

    if (Array.isArray(injectables[0])) {
        injectables = injectables[0];
    }

    return (Class) => {
        Class.$inject = injectables;
    };
}

/**
 * [component description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
component.defaults = {
    restrict: 'E',
    scope: {},
    bindToController: {},
    controllerAs: 'vm'
};
export function component(directiveName, options) {
    return (Class) => {

        if (typeof directiveName === 'object') {
            options = directiveName;
            directiveName = pascalCaseToCamelCase(Class.name);
        } else {
            directiveName = pascalCaseToCamelCase(directiveName);
        }
        options = options || (options = {});
        options.bindToController = options.bindToController || options.bind || {};

        app.directive(directiveName, () => {
            return angular.merge({}, component.defaults, {
                controller: Class
            }, options || {});
        });

        if (Class.$initState) {
            Class.$initState(directiveName);
        }

        Class.$isComponent = true;
    };
}

/**
 * [state description]
 * @param  {[type]} stateName [description]
 * @param  {[type]} options   [description]
 * @return {[type]}           [description]
 *
 * import { Start } from './components/start';
 * @RouteConfig([
 * 	{ path: '/', component: Start }
 * ])
 * class App {}
 */
export function state(stateName, options) {
    return (Class) => {

        if (Class.$isComponent) {
            throw new Error('@state() must be placed after @component()!');
        }

        Class.$initState = (directiveName) => {
            var urlParams = (options.url.match(/:.*?(\/|$)/g) || []).map((match) => {
                return match.replace(/\/$/, '').replace(/^:/, '');
            });

            app.config(($stateProvider) => {
                var resolveAttr = options.resolve ? 'resolved="stateVm.resolved"' : '';
                var htmlName = camelCaseToDashCase(directiveName);
                var injectables = ['$stateParams', '$scope'];
                // <my-directive param-one="$stateParams['paramOne']" param-two="$stateParams['paramTwo']">
                var attrValuePairs = urlParams.map((param) => {
                    return camelCaseToDashCase(param) + '="__$stateParams[\'' + param + '\']"';
                }).join(' ');
                var template = `<${htmlName} ${attrValuePairs} ${resolveAttr}>`;


                if (options.resolve) {
                    angular.forEach(options.resolve, (value, key) => injectables.push(key));
                }


                $stateProvider.state(stateName, angular.merge({
                    controller: ctrl,
                    controllerAs: 'stateVm',
                    template: template
                }, options));


                ctrl.$inject = injectables;

                function ctrl($stateParams, $scope) {
                    var args = Array.prototype.slice.call(arguments, 2);

                    $scope.__resolved = this.resolved = {};
                    $scope.__$stateParams = $stateParams;

                    angular.forEach(args, (val, key) => $scope.__resolved[injectables[key + 2]] = val);
                }
            });
        };

    };
}
