'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-enter
 * @description
 * Ejecuta la función cuando se presiona la tecla ```Enter``` en el elemento. Si el elemento está dentro de un formulario, sólo ejecuta la función cuando el formulario es válido.
 *
 * @example
    <example module="app" deps="" animate="false">
    <file name="index.html">
      <input type="text" label="Ingrese un nombre y presione enter" plex-enter="pressed = true" ng-model="nombre" plex />
      <div class="alert alert-warning" ng-show="pressed">Enter presionado</div>
      </file>
    </example>
**/
angular.module('plex').directive('plexEnter', function() {
    return {
        restrict: "A",
        require: '?^form',
        scope: false,
        link: function(scope, element, attrs, formController) {
            element.on("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        if (formController)
                            scope.$broadcast('$plex-before-submit', formController);
                        if (formController && formController.$valid)
                            scope.$eval(attrs.plexEnter, {
                                'event': event
                            });
                    });
                    event.preventDefault();
                }
            });
        }
    }
});
