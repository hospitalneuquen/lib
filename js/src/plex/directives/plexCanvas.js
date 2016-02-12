'use strict';

angular.module('plex').directive('plexCanvas', ['$q', 'angularLoad', function($q, angularLoad) {
    return {
        restrict: 'E',
        templateUrl: '/lib/js/dist/plex-canvas/template.html',
        link: function(scope, element, attrs) {
            var config;
            var backgroundImg = new Image();

            function init() {
                console.log("Canvas init inside");

                // Preload background
                if (config.background) {
                    backgroundImg.src = config.background;
                }

                // Carga librerías
                $q.all([
                    angularLoad.loadCSS("/lib/js/dist/plex-canvas/svg-editor.css"),
                    angularLoad.loadScript("/lib/js/dist/plex-canvas/svg-editor.min.js")
                ]).then(function() {
                    console.log("Canvas Loaded!");
                    // Configura elementos
                    angular.element('#workarea').css({
                        width: Number(attrs.width),
                        height: Number(attrs.height)
                    });

                    // Configura editor
                    svgEditor.setConfig({
                        lang: 'es',
                        canvas_expansion: 1,
                        dimensions: [Number(attrs.width), Number(attrs.height)],
                        noDefaultExtensions: true,
                        bkgd_url: config.background,
                        imgPath: '/lib/js/dist/plex-canvas/images/',
                        langPath: '/lib/js/dist/plex-canvas/locale/',
                        extPath: '/lib/js/dist/plex-canvas/extensions/',
                        extensions: [
                            'ext-salud-dibujos.js',
                            'ext-salud-defaults.js',
                        ],
                        initFill: {
                            color: 'none',
                            opacity: 1
                        },
                        initStroke: {
                            width: 1,
                            color: '000000',
                            opacity: 1
                        },
                        noStorageOnLoad: true,
                        showRulers: false,
                        no_save_warning: true,
                        show_outside_canvas: false,
                        selectNew: false,
                        allowedOrigins: [window.location.origin]
                    });

                    svgEditor.setCustomHandlers({
                        //save: function (win, data) {
                        //    modelController.$modelValue.svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + data
                        //},
                        exportImage: function(win, data) {
                            //debugger;
                            if (svgEditor.canvas.undoMgr.getUndoStackSize() > 0) {
                                config.svg = data.svg;
                                var canvas = $('<canvas>', {
                                    id: 'export_canvas'
                                }).hide().appendTo('body');
                                canvas[0].width = svgEditor.curConfig.dimensions[0];
                                canvas[0].height = svgEditor.curConfig.dimensions[1];
                                var context = canvas[0].getContext('2d');
                                context.fillStyle = 'white';
                                context.fillRect(0, 0, canvas[0].width, canvas[0].height);
                                if (config.background)
                                    context.drawImage(backgroundImg, 0, 0);
                                //canvg(canvas[0], data.svg, {
                                //    ignoreClear: true,
                                //    ignoreDimensions: true,
                                //    renderCallback: function () {
                                //        var base64 = canvas[0].toDataURL(data.mimeType);
                                //        prestacion.informe.png = base64;
                                //        canvas.remove();
                                //    }
                                //});
                            }
                        }
                    })

                    // Init
                    console.log("init canvas");
                    svgEditor.init();
                    if (config && config.svg) {
                        svgEditor.loadFromString(config.svg);
                        //svgEditor.canvas.undoMgr.resetUndoStack();
                    }
                });
            }

            // Eventos
            scope.$watch(attrs.config, function(current, old) {
                if (current && !config) {
                    config = current;
                    init();
                }
            });

            scope.$on('$canvas-update-model', function() {
                if (svgEditor.canvas.undoMgr.getUndoStackSize() > 0) {
                    // SVG
                    config.svg = svgCanvas.svgCanvasToString();
                    // PNG
                    var canvas = $('<canvas>', {
                        id: 'export_canvas'
                    }).hide().appendTo('body');
                    canvas[0].width = svgEditor.curConfig.dimensions[0];
                    canvas[0].height = svgEditor.curConfig.dimensions[1];
                    var context = canvas[0].getContext('2d');
                    context.fillStyle = 'white';
                    context.fillRect(0, 0, canvas[0].width, canvas[0].height);
                    if (config.background)
                        context.drawImage(backgroundImg, 0, 0);
                    canvg(canvas[0], config.svg, {
                        ignoreClear: true,
                        ignoreDimensions: true,
                        renderCallback: function() {
                            var base64 = canvas[0].toDataURL('image/png');
                            config.png = base64;
                            canvas.remove();
                        }
                    });
                }
            });

            scope.$on('$destroy', function() {
                angular.element('#svg_editor').remove();
            });
        }
    };
}])
