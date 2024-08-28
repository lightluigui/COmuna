// Função para importar todos os arquivos PDF de uma pasta em um novo documento InDesign
function importPDFsInFolder(folderPath) {
    var folder = new Folder(folderPath);
    var files = folder.getFiles("*.pdf"); // Ajustado para arquivos .pdf

    if (files.length == 0) {
        alert("Nenhum arquivo PDF encontrado na pasta especificada.");
        return null;
    }

    var mergedDocument = app.documents.add();
    var page, pdfPageOptions;

    // Configuração para importar PDFs
    pdfPageOptions = app.pdfPlacePreferences;
    pdfPageOptions.pdfCrop = PDFCrop.CROP_MEDIA; // Configura para colocar todo o conteúdo do PDF

    for (var i = 0; i < files.length; i++) {
        var pdfFile = new File(files[i]);

        // Adiciona uma nova página para cada página do PDF importado
        var tempDoc = app.open(pdfFile, false); // Abre o PDF sem exibir

        for (var j = 0; j < tempDoc.pages.length; j++) {
            if (mergedDocument.pages.length == 0) {
                page = mergedDocument.pages.add();
            } else {
                page = mergedDocument.pages.add(LocationOptions.AT_END);
            }

            mergedDocument.pages[-1].place(pdfFile, [0, 0], j + 1);
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

var inputFolderPath = Folder.selectDialog("Selecione a pasta contendo os arquivos PDF");
var outputFolderPath = Folder.selectDialog("Selecione a pasta para salvar o PDF exportado");

if (inputFolderPath && outputFolderPath) {
    var mergedDoc = importPDFsInFolder(inputFolderPath.fsName);
    if (mergedDoc) {
        exportToPDF(mergedDoc, outputFolderPath.fsName);
        mergedDoc.close(SaveOptions.NO);
        alert("Exportação concluída com sucesso!");
    }
} else {
    alert("Operação cancelada.");
}
