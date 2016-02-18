'use strict';


/**
 * @ngdoc directive
 * @module plex
 * @name plex-submit
 * @description
 * Emite un evento ```$plex-before-submit``` para indicar a la directiva {@link module:plex.directive:plex} que valide el modelo asociado.
 * @restrict A
 **/
angular.module('plex').directive("plexSubmit", ["$parse", function ($parse) {
    return {
        restrict: "A",
        require: '^form',
        scope: false,
        link: function (scope, element, attrs, formController) {
            var fn = $parse(attrs.plexSubmit);
            element.on('click', function (event) {
                scope.$apply(function () {
                    scope.$broadcast('$plex-before-submit', formController);
                    if (formController.$valid)
                        fn(scope, { $event: event });
                });
            });
        }
    }
}]);
