'use strict'

/**
 * @ngdoc directive
 * @module plex
 * @name plex-working
 * @description
 * Cambia un ícono de Font-Awesome a un spinner (http://fortawesome.github.io/Font-Awesome/icon/spinner/) cuando el valor valida en ```true```.
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <a class="btn btn-default" ng-model="loading" ng-click="loading = !loading"><i class="fa fa-gear" plex-working="loading"></i><span>Configurar aplicación</span></a>
      </file>
    </example>
 **/
angular.module('plex').directive("plexWorking", function ($injector) {
    return function (scope, element, attrs) {
        if (element[0].className.indexOf('fa-')) {
            var originalClass = element.attr('class');
            var workingClass = originalClass;
            var classes = workingClass.split(/\s+/);;
            for (var i = 0; i < classes.length; i++) {
                if (classes[i].indexOf('fa-') == 0) {
                    workingClass = workingClass.replace(classes[i], 'fa-spinner fa-spin');
                    break;
                }
            }

            scope.$watch(attrs.plexWorking, function (current) {
                element.attr('class', (current) ? workingClass : originalClass)
            });
        }
    }
});
