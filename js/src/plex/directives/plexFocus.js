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
angular.module('plex').directive('plexFocus', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (attr.plexFocus) {
                scope.$watch(attr.plexFocus, function(current) {
                    if (current) {
                        $window.setTimeout(function() {
                            element[0].focus();
                        }, 200);
                    }
                });
            } else { // No se especificó ninguna expresión
                $window.setTimeout(function() {
                    element[0].focus();
                }, 200);
            }
        }
    };
}]);
