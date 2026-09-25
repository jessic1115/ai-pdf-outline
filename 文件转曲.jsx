#target illustrator

function main() {
    var inputFolder = Folder.selectDialog("请选择包含 PDF 的文件夹");
    if (!inputFolder) return;
    var files = inputFolder.getFiles("*.pdf");
    if (files.length === 0) { alert("该文件夹下没有 PDF 文件"); return; }
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    var processed = 0;
    var errors = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var displayName = decodeURIComponent(file.name);
        try {
            var doc = app.open(file);
            for (var l = 0; l < doc.layers.length; l++) { doc.layers[l].locked = false; }
            app.executeMenuCommand("selectall");
            try { app.executeMenuCommand("创建轮廓"); } catch (e) { app.executeMenuCommand("outline"); }
            doc.selection = null;
            app.executeMenuCommand("save");
            doc.close(SaveOptions.DONOTSAVECHANGES);
            processed++;
        } catch (e) { errors.push(displayName + " -> " + e.message); }
    }
    app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
    var msg = "处理完成！成功覆盖 " + processed + " 个文件。";
    if (errors.length > 0) { msg += "\n\n异常情况：\n" + errors.join("\n"); }
    alert(msg);
}

main();