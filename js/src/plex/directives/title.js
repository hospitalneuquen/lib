/**
 * @ngdoc directive
 * @module plex
 * @name title
 * @description
 * Mejora el tooltip del elemento. Actualmente funciona como adaptador de la directiva ```bs-tooltip``` (http://mgcrea.github.io/angular-strap/#/tooltips).
 * @restrict A
 * @param {string=} title-placement Ubicación del tooltipo. *Por defecto: top*
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <div class="alert alert-info" title="Este es un tooltip">Pasa por el mouse aquí arriba ...<div>
      </file>
    </example>
 **/
angular.module('plex').directive('title', ['$tooltip', function ($tooltip) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.title) {
                var options = {
                    title: attrs.title,
                    placement: attrs.titlePlacement || "top",
                    html: true,
                    container: "body",
                    animation: "am-fade-and-slide-top"
                };
                element.removeAttr("title");
                var tooltip = $tooltip(element, options);
                
                scope.$on('$destroy', function () {
                    tooltip.destroy();
                });
            }
        }
    };
}]);
