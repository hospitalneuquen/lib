
angular.module('plex').directive('plexActions', ['$dropdown', '$tooltip', function($dropdown, $tooltip) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {
            var dropDown;

            // Crea un ícono si no lo tiene con el dropdown
            var icon = element.is("I") ? element : angular.element('<i>').appendTo(element);
            icon.addClass('hover');
            if (!icon.hasClass("mdi"))
                icon.addClass('mdi mdi-dots-vertical');
            // icon.on('click', function(e) {
            //     e.preventDefault();
            //     e.stopPropagation();
            // });

            // Watches
            scope.$watch(attrs.plexActions, function(actions) {
                if (dropDown) {
                    try {
                        dropDown.destroy();
                    } catch (e) {}
                    dropDown = false;
                }

                if (actions) {
                    // Convierte las acciones al formato elegido
                    var content = [];
                    actions.forEach(function(i) {
                        if (!angular.isDefined(i.visible) || i.visible)
                            content.push({
                                text: (i.icon ? "<i class='" + i.icon + "'></i>" : "") + "<span>" + (i.title || i.text) + "</span>",
                                divider: i.divider,
                                click: function() {
                                    i.handler(scope.$parent);
                                },
                            });
                    });

                    scope.content = content;
                    var options = {
                        scope: scope,
                        placement: attrs.placement || 'auto'
                    };
                    dropDown = $dropdown(icon.parent().hasClass('btn') ? icon.parent() : icon, options);
                }
            });

            scope.$on('$destroy', function() {
                if (dropDown) {
                    try {
                        dropDown.hide();
                        dropDown.destroy();
                    } catch (e) {}
                    dropDown = false;
                }
            });
        }
    };
}]);
