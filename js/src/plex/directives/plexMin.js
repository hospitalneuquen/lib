/**
 * @ngdoc directive
 * @module plex
 * @name plex-min
 * @description
 * Agrega un validador de valor mínimo. Requiere la directiva {@link module:plex.directive:plex}.
 * @priority 599
 * @restrict A
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <label>Ingrese un valor menor a 5 para mostrar el error</label><br/>
        <input type="text" ng-model="modelo" plex="int" plex-min="5" />
      </file>
    </example>
 **/
angular.module('plex').directive('plexMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 599, // Corre posterior a la directiva 'plex'
        link: function (scope, elem, attr, ctrl) {
            // Validator
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === '' || value === null || value !== value;
            };
            var validator = function (value) {
                var val = scope.$eval(attr.plexMin);
                if (isEmpty(value) || isEmpty(val) || value >= val) {
                    ctrl.$setValidity('min', true);
                    return value;
                } else {
                    ctrl.$setValidity('min', false);
                    return undefined;
                }
            };

            // Watch for min to change
            scope.$watch(attr.plexMin, function (current, old) {
                if (current != old)
                    if (validator(ctrl.$viewValue)) {
                        // Cuando cambia la cota, fuerza a que si tiene un valor actual, lo tome en el modelo
                        ctrl.$setViewValue(ctrl.$viewValue);
                    }
            });

            ctrl.$parsers.push(validator);
            ctrl.$formatters.push(validator);
        }
    };
});
