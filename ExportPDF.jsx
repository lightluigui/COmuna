'#target indesing';

// Função para abrir todos os arquivos de uma pasta
function openFilesInFolder(folderPath) {
    var folder = new Folder(folderPath);
    var files = folder.getFiles("*.jpg"); // Considerando arquivos .indd, ajuste conforme necessário

    if (files.length == 0) {
        alert("Nenhum arquivo encontrado na pasta especificada.");
        return null;
    }

    var mergedDocument = app.documents.add();
    for (var i = 0; i < files.length; i++) {
        var tempDoc = app.open(files[i]);
        
        // Importa todas as páginas do documento temporário para o documento final
        for (var j = 0; j < tempDoc.pages.length; j++) {
            tempDoc.pages[j].duplicate(LocationOptions.AT_END, mergedDocument.pages[-1]);
        }
        tempDoc.close(SaveOptions.NO);
    }

    return mergedDocument;
}

// Função para exportar o documento como PDF/X-1a:2001 com sangria e marcas de corte
function exportToPDF(document, outputFolder) {
    var pdfExportPreset = app.pdfExportPresets.itemByName("PDF/X-1a:2001");

    if (!pdfExportPreset.isValid) {
        alert("Predefinição PDF/X-1a:2001 não encontrada.");
        return;
    }

    // Configurações de exportação de PDF
    var pdfFile = new File(outputFolder + "/output.pdf");
    var pdfExportOptions = app.pdfExportPreferences;
    
    pdfExportOptions.bleedTop = 3;
    pdfExportOptions.bleedBottom = 3;
    pdfExportOptions.bleedInside = 3;
    pdfExportOptions.bleedOutside = 3;
    
    pdfExportOptions.cropMarks = true;

    document.exportFile(ExportFormat.PDF_TYPE, pdfFile, false, pdfExportPreset);
}

var inputFolderPath = Folder.selectDialog("Selecione a pasta contendo os arquivos InDesign");
var outputFolderPath = Folder.selectDialog("Selecione a pasta para salvar o PDF exportado");

if (inputFolderPath && outputFolderPath) {
    var mergedDoc = openFilesInFolder(inputFolderPath.fsName);
    if (mergedDoc) {
        exportToPDF(mergedDoc, outputFolderPath.fsName);
        mergedDoc.close(SaveOptions.NO);
        alert("Exportação concluída com sucesso!");
    }
} else {
    alert("Operação cancelada.");
}
