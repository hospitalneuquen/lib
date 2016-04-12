/**
 * @ngdoc directive
 * @module plex
 * @name plex-submit
 * @description
 * Emite un evento ```$plex-before-submit``` para indicar a la directiva {@link module:plex.directive:plex} que valide el modelo asociado.
 * @restrict A
 **/
angular.module('plex').directive("plexSubmit", ["$parse", "$timeout", function($parse, $timeout) {
    return {
        restrict: "A",
        require: '^form',
        scope: false,
        link: function(scope, element, attrs, formController) {
            var fn = $parse(attrs.plexSubmit);
            var icon = element.children("I").eq(0);
            var originalClass = icon[0].className;
            
            element.on('click', function(event) {
                scope.$apply(function() {
                    scope.$broadcast('$plex-before-submit', formController);
                    if (formController.$valid) {
                        var promise = fn(scope, {
                            $event: event
                        });
                        if (promise && promise.finally) {
                            // Disable button
                            element.attr('disabled', 'disabled');
                            // DOM changes
                            icon.removeClass();
                            icon.addClass('mdi mdi-google-circles-extended icon-spinner');
                            // When done ...
                            promise.finally(function() {
                                // Restore button state
                                element.removeAttr('disabled');
                                // Show check icon
                                icon.removeClass();
                                icon.addClass('mdi mdi-check');
                                // Restore original icon
                                $timeout(function(){
                                    icon.removeClass();
                                    icon.addClass(originalClass);
                                }, 2000);
                            });
                        }
                    }
                });
            });
        }
    };
}]);
