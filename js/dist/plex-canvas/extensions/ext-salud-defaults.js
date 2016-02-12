svgEditor.addExtension('salud-defaults', function () {
    'use strict';
    var svgCanvas = svgEditor.canvas;

    // Font
    window.setTimeout(function () {
        try{
            svgCanvas.setFontFamily("Verdana");
            svgCanvas.setFontSize(14);
        } catch (E) {
        }
    }, 500);

    // Deniega el zoom
    svgCanvas.bind('zoomed', function () {
    });

    // Pone en modo Selección después de insertar
    svgCanvas.bind('changed', function () {
        var command = svgCanvas.undoMgr.undoStack[svgCanvas.undoMgr.undoStack.length - 1];
        if (command.type() == "svgedit.history.InsertElementCommand" && command.text.indexOf('text') < 0)
            svgCanvas.setMode('select');
    });

    return {
    };
});

