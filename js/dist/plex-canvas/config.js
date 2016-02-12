svgEditor.setConfig({
    lang: 'es',
    canvas_expansion: 1,
    dimensions: [400, 400],
    noDefaultExtensions: true,
    bkgd_url: 'fondo.png',
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
    exportImage: function (win, data) {
        var canvas = $('<canvas>', { id: 'export_canvas' }).hide().appendTo('body');
        canvas[0].width = svgEditor.curConfig.dimensions[0];
        canvas[0].height = svgEditor.curConfig.dimensions[1];
        canvg(canvas[0], data.svg, {
            renderCallback: function () {
                var datauri = canvas[0].toDataURL(data.mimeType);
                alert("Aca!");
                canvas.remove();
            }
        });


    }
});

function guardar() {
    svgEditor.canvas.rasterExport('png');
}
