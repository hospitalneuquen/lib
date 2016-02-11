'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-enter
 * @description
 * Ejecuta la función cuando se presiona la tecla ```Enter``` en el elemento
 *
 * @example
    <example module="app" deps="" animate="false">
    <file name="index.html">
      <input type="text" label="Ingrese un nombre y presione enter" plex-enter="pressed = true" ng-model="nombre" plex />
      <div class="alert alert-warning" ng-show="pressed">Enter presionado</div>
      </file>
    </example>
**/
angular.module('plex').directive('plexEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.plexEnter, { 'event': event });
                });
                event.preventDefault();
            }
        });
    };
});
