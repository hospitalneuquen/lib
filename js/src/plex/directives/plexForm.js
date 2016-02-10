'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-form
 * @description
 * Muestra un botón de Guardar y otro de Cancelar asociados a dos funciones. El botón Guardar se habilita sólo cuando formulario es válido.
 *
 * Este directiva será reemplazada por {@link module:plex.directive:plex-submit}.
 * @restrict A
 **/
angular.module('plex').directive("plexForm", ["Plex", function (Plex) {
    return {
        restrict: "A",
        require: 'form',
        link: function (scope, element, attrs, formController) {
            // Vincula con la vista a través del servicio Plex
            var submitHandler, cancelHandler;
            if (attrs.plexForm) {
                var split = attrs.plexForm.split(',');
                submitHandler = scope.$eval(split[0]) || scope.$eval('submit');
                if (split.length > 1)
                    cancelHandler = scope.$eval(split[1]) || scope.$eval('cancel');
                else
                    cancelHandler = scope.$eval('cancel')
            }
            Plex.linkForm(formController, submitHandler, cancelHandler);

            // On destroy
            scope.$on("$destroy", function () {
                Plex.unlinkForm(formController);
            });
        }
    }
}]);
