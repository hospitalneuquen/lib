'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-include
 * @description
 * Permite incluir vistas parciales al igual que ```ng-include``` pero permitiendo pasar parámetros.
 * @param {string=} plex-include-miParametro Define la propiedad include.miParametro con el valor pasado en ```$scope```
 *
 * Por ejemplo
 *
 *     <div plex-include="'miArchivo.html'" plex-include-numero="5" plex-include-texto="miPropiedad"></div>
 *
 * permite al controlador referenciado en *miArchivo.html* acceder a
 *
 *     $scope.include.numero
 *     $scope.include.texto
 *
**/
﻿angular.module('plex').directive('plexInclude', function () {
    return {
        scope: true,
        template: '<div ng-include="plexInclude"></div>',
        /*
        templateUrl: function (element, attrs) {
            return attrs.plexInclude;
        },
        */
        link: function (scope, element, attrs) {
            // Observa cambios en la URL
            scope.plexInclude = scope.$eval(attrs.plexInclude);
            scope.$watch(attrs.plexInclude, function (current) {
                scope.plexInclude = current;
            });

            // Inyecta una propiedad 'include' en el scope que tendrá todos los parámetros pasados en todos los atributos que comienza con el plefijo "plexInclude"
            scope.include = {};

            // Observa cambios en todos los parámetros
            angular.forEach(attrs, function (value, attr) {
                if (attr.indexOf('plexInclude') == 0 && attr != 'plexInclude') {
                    var item = attr.substr(11, 1).toLowerCase() + attr.substr(12);
                    scope.$watch(value, function (current) {
                        scope.include[item] = current;
                    });
                }
            });
        }
    };
});
