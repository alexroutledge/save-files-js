var globals = {};
globals.util = {
    showSave: true,
    DownloadAttributeSupport: 'download' in document.createElement('a'),
    BrowserSupportedMimeTypes: {
        "image/jpeg": true,
        "image/png": true,
        "image/gif": true,
        "image/svg+xml": true,
        "image/bmp": true,
        "image/x-windows-bmp": true,
        "image/webp": true,
        "audio/wav": true,
        "audio/mpeg": true,
        "audio/webm": true,
        "audio/ogg": true,
        "video/mpeg": true,
        "video/webm": true,
        "video/ogg": true,
        "text/plain": true,
        "text/html": true,
        "text/xml": true,
        "application/xhtml+xml": true,
        "application/json": true
    },
    saveData: function () {
        if (!globals.util.showSave) {
            alert("Your browser does not support any method of saving JavaScript gnerated data to files.");
            return;
        }
        globals.util.showSave(
            document.getElementById("data").value,
            document.getElementById("filename").value,
            document.getElementById("mimetype").value);
    }
}
//var DownloadAttributeSupport = 'download' in document.createElement('a');
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

if (BlobBuilder && (window.saveAs || navigator.saveBlob)) {
    globals.util.showSave = function (data, name, mimeType) {
        var builder = new BlobBuilder();
        builder.append(data);
        var blob = builder.getBlob(mimetype || "application/octet-stream");
        if (!name) name = "Download.bin";
        if (window.saveAs) {
            window.saveAs(blob, name);
        } else {
            navigator.saveBlob(blob, name);
        }
    };
} else if (BlobBuilder && URL) {
    globals.util.showSave = function (data, name, mimetype) {
        var blob, url, builder = new BlobBuilder();
        builder.append(data);
        if (!mimetype) mimetype = "application/octet-stream";
        if (globals.util.DownloadAttributeSupport) {
            blob = builder.getBlob(mimetype);
            url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", name || "Download.bin");
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            link.dispatchEvent(event);
        } else {
            if (globals.util.BrowserSupportedMimeTypes[mimetype.split(";")[0]] === true) {
                mimetype = "application/octet-stream";
            }

            blob = builder.getBlob(mimetype);
            url = URL.createObjectURL(blob);
            window.open(url, '_blank', '');
        }
        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 250);
    };
} else if (!/\bMSIE\b/.test(navigator.userAgent)) {
    globals.util.showSave = function (data, name, mimetype) {
        if (!mimetype) mimetype = "application/octet-stream";
        if (globals.util.BrowserSupportedMimeTypes[mimetype.split(";")[0]] === true) {
            mimetype = "application/octet-stream";
        }
        window.open("data:" + mimetype + "," + encodeURIComponent(data), '_blank', '');
    };
}
