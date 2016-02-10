'use strict'

/**
 * @ngdoc directive
 * @module plex
 * @name plex-max
 * @description
 * Agrega un validador de valor máximo. Requiere la directiva {@link module:plex.directive:plex}.
 * @priority 599
 * @restrict A
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <label>Ingrese un valor mayor a 5 para mostrar el error</label><br/>
        <input type="text" ng-model="modelo" plex="int" plex-max="5" />
      </file>
    </example>
 **/
angular.module('plex').directive('plexMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 599, // Corre posterior a la directiva 'plex'
        link: function (scope, elem, attr, ctrl) {
            // Validator
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === '' || value === null || value !== value;
            }
            var validator = function (value) {
                var val = scope.$eval(attr.plexMax);
                // 02/10/2015 | jgabriel | Corrije el bug de angular-strap's datepicker que manda un string en vez de date
                if (isEmpty(value) || isEmpty(val) || value <= val) {
                    ctrl.$setValidity('max', true);
                    return value;
                } else {
                    ctrl.$setValidity('max', false);
                    return undefined;
                }
            };

            // Watch for max to change
            scope.$watch(attr.plexMax, function (current, old) {
                if (current != old) {
                    if (validator(ctrl.$viewValue))
                        // Cuando cambia la cota, fuerza a que si tiene un valor actual, lo tome en el modelo
                        ctrl.$setViewValue(ctrl.$viewValue);
                    else
                        ctrl.$setViewValue(undefined);
                }
            });
            ctrl.$parsers.push(validator);
            ctrl.$formatters.push(validator);
        }
    };
});
