/**
 * @ngdoc directive
 * @module plex
 * @name plex
 * @description
 * Decora un ```input[type=text]``` de acuerdo al tipo de datos y agrega validación de Angular + Bootstrap
 * El tipo de datos puede ser:
 * - **text**: Valor por defecto.
 * - **html**: Decora el campo con un editor HTML. Actualmente funciona como adaptador de la directiva ```text-angular``` (https://github.com/fraywing/textAngular).
 * - **int**: Permite sólo valores numéricos enteros.
 * - **float**: Permite sólo valores numéricos enteros o decimales.
 * - **date**: Decora el campo con un selector de fecha. Actualmente funciona como adaptador de la directiva ```bs-datepicker``` (http://mgcrea.github.io/angular-strap/#/datepickers).
 * - **time**: Decora el campo con un selector de hora. Actualmente funciona como adaptador de la directiva ```bs-timepicker``` (http://mgcrea.github.io/angular-strap/#/timepickers).
 * - **bool**: Decora el campo con un slider booleano. **ATENCIÓN: ¡Actualmente no funciona con la última versión de Angular!
 * - Si no es ninguno de los tipos de datos anteriores, asume que es un {@link module:plex.directive:plex-select}.
 *
 * @priority 598
 * @restrict EAC
 * @param {string=} label Agrega un elemento **<label>** antes del campo de texto
 * @param {string=} hint Agrega un bloque de ayuda debajo del campo de texto
 * @param {string=} prefix Agrega un prefijo antes del campo de texto
 * @param {string=} suffix Agrega un sufijo después del campo de texto
 * @param {boolean=} selectOnly *Sólo válida para tipo de datos ```date```*. Muestra sólo el selector y no permite escribir.
 * @param {string=} date-format *Sólo válida para tipo de datos ```date```*. Formato de la fecha a mostrar. Para más opciones leer la documentación de http://mgcrea.github.io/angular-strap/#/datepickers
 * @param {string=} true *Sólo válida para tipo de datos ```bool```*. Texto a mostrar para el valor ```true``` ("Si" por defecto)
 * @param {string=} false *Sólo válida para tipo de datos ```bool```*. Texto a mostrar para el valor ```false``` ("No" por defecto)
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <div class="row">
            <div class="col-xs-6"><input type="text" label="Ingrese nombre de la persona" ng-model="persona.nombre" plex /></div>
            <div class="col-xs-6"><input type="text" label="Fecha de nacimiento" ng-model="persona.nacimiento" plex="date" /></div>
        </div>
        <div class="row">
            <div class="col-xs-6"><input type="text" label="Altura" ng-model="persona.altura" plex="float" suffix="Mts" /></div>
            <div class="col-xs-6"><input type="text" label="¿Tiene obra social?" ng-model="persona.obraSocial" plex="bool" /></div>
        </div>
        <pre ng-show="persona">{{persona | json}}</pre>
      </file>
    </example>
 **/
angular.module('plex').directive("plex", ['$injector', function($injector) {
    return {
        restrict: 'EAC',
        require: ['?ngModel', '^?form'],
        priority: 598, // Para que el postLink ejecute último. ng-if tiene prioridad 600
        compile: function(element, attrs) {
            // Determina el tipo
            var type = element.is("SELECT") ? "select" : (attrs.plex || (attrs.type == 'password' ? 'text' : attrs.type));

            // Inyecta dinámicamente directivas
            var dinamicLink = null;
            switch (type) {
                case "date":
                    element.attr("bs-datepicker", "");
                    attrs.autoclose = true;
                    attrs.dateFormat = attrs.dateFormat || "mediumDate";
                    dinamicLink = $injector.get("bsDatepickerDirective")[0].compile(element, attrs);
                    break;
                case "time":
                    element.attr("bs-timepicker", "");
                    attrs.autoclose = true;
                    //attrs.minuteStep = attrs.minuteStep || 30;  POR UN BUG NO FUNCIONA. Esperando solución
                    dinamicLink = $injector.get("bsTimepickerDirective")[0].compile(element, attrs);
                    break;
                case "select":
                    attrs.plexSelect = attrs.plex;
                    dinamicLink = $injector.get("plexSelectDirective")[0].compile(element, attrs);
                    break;
                case "html":
                    dinamicLink = $injector.get("textAngularDirective")[0].compile(element, attrs);
                    break;
            }

            return {
                post: function(scope, element, attrs, controllers) {
                    var modelController = controllers[0];
                    var formController = controllers[1];

                    // Crea el contenedor
                    var newParent = (type == 'radio' || type == 'checkbox') ? angular.element("<div class='" + type + "'>") : angular.element("<div class='form-group'>");

                    // Label
                    var label;
                    if (attrs.label) {
                        var texto = attrs.label == "\\" ? "&nbsp;" : attrs.label;
                        label = angular.element("<label>").html(texto); /* Usa \ para dejar un label vacío */
                        // Insert texto "Opcional"
                        if (attrs.ngRequired) {
                            scope.$watch(attrs.ngRequired, function(current) {
                                if (current === false)
                                    label.html(texto + "<span class='optional text-muted'>(opcional)</span>");
                                else
                                    label.html(texto);
                            });
                        }
                        newParent.append(label);
                    }

                    // Actualiza el DOM
                    element.before(newParent);
                    element.detach();
                    if (type == 'radio' || type == 'checkbox') {
                        var rippleContainer = angular.element("<span>");
                        rippleContainer.append(element);
                        label.prepend(rippleContainer);
                        // // Ripple
                        // $mdInkRipple.attach(scope, rippleContainer, {
                        //     center: true,
                        //     dimBackground: false,
                        //     fitRipple: true
                        // });
                    } else
                        newParent.append(element);


                    // Elementos de validación
                    if (type != 'radio' && type != 'checkbox') {
                        newParent.append("<span class='help-block'>Requerido</span>");
                        newParent.append("<span class='help-block'>Valor no válido</span>");
                        if (attrs.hint)
                            newParent.append(angular.element("<span class='help-block'>").text(attrs.hint));
                    }

                    // Validación
                    var validator = function(element, modelController) {
                        // Calcula valores
                        var required = typeof(modelController) != 'undefined' && !modelController.$pristine && modelController.$error.required;
                        var invalid = typeof(modelController) != 'undefined' && !modelController.$pristine && ((modelController.$error.pattern || modelController.$error.number || modelController.$error.max || modelController.$error.min || modelController.$error.date || modelController.$error.time || modelController.$error.maxlength || modelController.$error.minlength) || false);

                        // Muestra/oculta elementos
                        var controlGroup = element.parents(".form-group").eq(0);
                        controlGroup.toggleClass("has-error", required || invalid);
                        var spans = controlGroup.find(".help-block");
                        spans.eq(0).css("display", required ? "block" : "none");
                        spans.eq(1).css("display", invalid ? "block" : "none");
                    };

                    if (modelController) {
                        modelController.$parsers.push(function(value) {
                            validator(element, modelController);
                            return value;
                        });
                        scope.$watch(function() {
                            return modelController.$error;
                        }, function() {
                            validator(element, modelController);
                        }, true);
                    } else {
                        validator(element);
                    }

                    var inputGroup;
                    switch (type) {
                        case "date":
                            inputGroup = angular.element("<div class='input-group'>");
                            element.before(inputGroup);
                            element.detach();
                            if (attrs.selectOnly) {
                                element.attr('readonly', 'readonly');
                                element.css({
                                    cursor: "pointer"
                                });
                                element.on('click', function() {
                                    angular.element(this).next().find(".btn").click();
                                });
                            }
                            inputGroup.append(element);
                            element.addClass('form-control');
                            element.after(angular.element("<span class='input-group-btn'><a class='btn btn-default btn-flat' tabindex='-1'><i class='mdi mdi-calendar'></i></a></span>").on('click', function() {
                                // element.removeAttr('readonly');
                                element.focus();
                                // element.attr('readonly', 'readonly');
                            }));

                            // Soluciona el bug de ng-readonly
                            if (attrs.ngReadonly)
                                scope.$watch(attrs.ngReadonly, function(value) {
                                    if (value)
                                        element.attr("disabled", "disabled");
                                    else
                                        element.removeAttr("disabled");
                                });
                            break;
                        case "time":
                            inputGroup = angular.element("<div class='input-group'>");
                            element.before(inputGroup);
                            element.detach();
                            inputGroup.append(element);
                            element.addClass('form-control');
                            element.after(angular.element("<span class='input-group-btn'><a class='btn btn-default btn-flat' tabindex='-1'><i class='mdi mdi-clock'></i></a></span>").on('click', function() {
                                element.focus();
                            }));

                            // Soluciona el bug de ng-readonly
                            if (attrs.ngReadonly)
                                scope.$watch(attrs.ngReadonly, function(value) {
                                    if (value)
                                        element.attr("disabled", "disabled");
                                    else
                                        element.removeAttr("disabled");
                                });
                            break;
                        case "int":
                        case "float":
                            if (attrs.prefix || attrs.suffix) {
                                inputGroup = angular.element("<div class='input-group'>");
                                element.before(inputGroup);
                                element.detach();
                                if (attrs.prefix)
                                    inputGroup.append('<span class="input-group-addon">' + attrs.prefix + '</span>');
                                inputGroup.append(element);
                                if (attrs.suffix)
                                    inputGroup.append('<span class="input-group-addon">' + attrs.suffix + '</span>');
                            }

                            element.addClass('form-control');
                            // Permite sólo tipear dígitos
                            var numberParsers = function(value) {
                                if (value) {
                                    value = ("" + value).replace(",", ".");
                                    var regEx;
                                    if (type == "float")
                                        regEx = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
                                    else
                                        regEx = /^\s*(\-|\+)?(\d+)\s*$/;


                                    if (regEx.test(value)) {
                                        modelController.$setValidity('number', true);
                                        return parseFloat(value, 10);
                                    } else {
                                        modelController.$setValidity('number', false);
                                        return null;
                                    }
                                } else {
                                    return value;
                                }
                            };
                            if (modelController)
                                modelController.$parsers.unshift(numberParsers);
                            break;
                            // case "bool":
                            //     var id = "plex" + Math.floor((1 + Math.random()) * 0x10000);
                            //     element.attr("id", id);
                            //     element.attr("type", "checkbox");
                            //     element.attr("class", "onoffswitch-checkbox");
                            //     // Crea el div contenedor
                            //     var group = angular.element("<div class='onoffswitch'>");
                            //     element.before(group);
                            //     element.detach();
                            //     group.append(element);
                            //     // Crea el label
                            //     var label2 = angular.element('<label class="onoffswitch-label">').appendTo(group);
                            //     label2.attr("for", id);
                            //     var span = angular.element('<span class="onoffswitch-inner">').appendTo(label2);
                            //     span.attr("data-true", attrs.true || "Si");
                            //     span.attr("data-false", attrs.false || "No");
                            //     angular.element('<span class="onoffswitch-switch">').appendTo(label2);
                            //     break;
                        case "text":
                            if (attrs.prefix || attrs.suffix) {
                                inputGroup = angular.element("<div class='input-group'>");
                                element.before(inputGroup);
                                element.detach();
                                if (attrs.prefix)
                                    inputGroup.append('<span class="input-group-addon">' + attrs.prefix + '</span>');
                                inputGroup.append(element);
                                if (attrs.suffix)
                                    inputGroup.append('<span class="input-group-addon">' + attrs.suffix + '</span>');
                            }
                            element.addClass('form-control');
                    }

                    // Directivas dinámicas
                    if (dinamicLink)
                        dinamicLink(scope, element, attrs, modelController);

                    // Events & Watches
                    if (attrs.ngShow)
                        scope.$watch(attrs.ngShow, function(value) {
                            if (value)
                                newParent.show();
                            else
                                newParent.hide();
                        });
                    if (attrs.ngHide)
                        scope.$watch(attrs.ngHide, function(value) {
                            if (value)
                                newParent.show();
                            else
                                newParent.hide();
                        });

                    scope.$on("$plex-before-submit", function(event, submitController) { // Invocado desde Plex.submitForm()
                        // Dirty = true (i.e. fuerza que muestre los campos requeridos)
                        // if (modelController && formController == submitController)
                        //     modelController.$setViewValue(modelController.$viewValue);

                        if (modelController && formController == submitController) {
                            modelController.$setDirty();
                            validator(element, modelController);
                        }
                    });
                    element.on("$destroy", function() {
                        if (!element.data("$plex-destroy")) {
                            element.data("$plex-destroy", true);
                            newParent.remove();
                            element.data("$plex-destroy", null);
                        }
                    });
                }
            };
        }
    };
}]);
