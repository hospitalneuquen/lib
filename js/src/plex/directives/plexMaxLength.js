'use strict'

/**
 * @ngdoc directive
 * @module plex
 * @name plex-maxlength
 * @description
 * Agrega un validador de largo máximo de cadena de texto. Requiere la directiva {@link module:plex.directive:plex}.
 * @restrict A
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <label>Ingrese un valor texto de más de tres caracteres para mostrar el error</label><br/>
        <input type="text" ng-model="modelo" plex plex-maxlength="3" />
      </file>
    </example>
 **/
angular.module('plex').directive('plexMaxlength', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            // Validator
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === '' || value === null || value !== value;
            }
            var validator = function (value) {
                var val = scope.$eval(attr.plexMaxlength);
                if (isEmpty(value) || isEmpty(val) || value.length <= val) {
                    ctrl.$setValidity('maxlength', true);
                    return value;
                } else {
                    ctrl.$setValidity('maxlength', false);
                    return undefined;
                }
            };

            // Watch for max to change
            scope.$watch(attr.plexMaxlength, function (current, old) {
                if (current != old)
                    validator(ctrl.$viewValue);
            });

            ctrl.$parsers.push(validator);
            ctrl.$formatters.push(validator);
        }
    };
});
