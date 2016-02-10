'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-focus
 * @description
 * Activa el focus del elemento cuando cambia el valor de la propiedad asociada
 * @example
    <example module="app" deps="" animate="false">
    <file name="index.html">
      <a class="btn btn-default" ng-click="focused = focused + 1">Focus!</a><br><br>
      <input type="text" plex-focus="focused" ng-model="nombre" plex />
    </file>
    </example>
**/
angular.module('plex').directive('plexFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$watch(attr.plexFocus, function (current) {
                if (current) {
                    window.setTimeout(function () {
                        element[0].focus();
                    }, 200);
                }
            })
        }
    };
});
