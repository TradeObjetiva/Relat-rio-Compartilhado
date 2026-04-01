const fs = require('fs');
let code = fs.readFileSync('w:\\\\FABIANO\\\\PROGRAMAÇÃO\\\\SISTEMA DE RELATÓRIO\\\\script.js', 'utf-8');

// Refactor state
code = code.replace(
`const state = {
  rows: [],
  columns: [],
  originalFileName: ''
};`,
`const state = {
  files: [],
  activeIndex: 0
};`
);

// Add fileTabsContainer
code = code.replace(
`const loadingOverlay = document.getElementById('loadingOverlay');`,
`const loadingOverlay = document.getElementById('loadingOverlay');
const fileTabsContainer = document.querySelector('.file-tabs');`
);

// Refactor dropzone
code = code.replace(
`dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const file = e.dataTransfer.files?.[0];
  if (file) handleFile(file);
});`,
`dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files && files.length) handleFiles(files);
});`
);

// Refactor fileInput
code = code.replace(
`fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) handleFile(file);
});`,
`fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (files && files.length) handleFiles(files);
});`
);

// Refactor loadSampleBtn
code = code.replace(
`loadSampleBtn.addEventListener('click', async () => {
  toggleLoading(true);
  try {
    state.originalFileName = "exemplo_deluc";
    const response = await fetch('sample-deluc.csv');
    const content = await response.text(); // fetch handles UTF-8 correctly for sample

    setTimeout(() => {
      processCsv(content);
      toggleLoading(false);
    }, 100);
  } catch (error) {
    toggleLoading(false);
    showAlert('Erro', 'Não foi possível carregar o exemplo localmente.', 'error');
  }
});`,
`loadSampleBtn.addEventListener('click', async () => {
  toggleLoading(true);
  try {
    state.files = [];
    state.activeIndex = 0;
    const response = await fetch('sample-deluc.csv');
    const content = await response.text();

    setTimeout(() => {
      const processed = processCsv(content, "exemplo_deluc");
      if (processed) {
        state.files.push(processed);
        renderApp();
      }
      toggleLoading(false);
    }, 100);
  } catch (error) {
    toggleLoading(false);
    showAlert('Erro', 'Não foi possível carregar o exemplo localmente.', 'error');
  }
});`
);

// Refactor handleFile -> handleFiles
code = code.replace(
`function handleFile(file) {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    showAlert('Aviso', 'Por favor, selecione um arquivo válido com a extensão .CSV', 'warning');
    return;
  }

  state.originalFileName = file.name.replace(/\\.[^/.]+$/, "");

  toggleLoading(true);

  const reader = new FileReader();
  reader.onload = (e) => {
    // Timeout added so UI can render the loading spinner cleanly before heavy processing
    setTimeout(() => {
      processCsv(e.target.result);
      toggleLoading(false);
    }, 100);
  };
  reader.onerror = () => {
    toggleLoading(false);
    showAlert('Erro', 'Falha ao ler o arquivo selecionado.', 'error');
  };
  // Lê forçando o padrão Windows-1252 para corrigir acentos do Brasil (típico de exportações Windows/Excel)
  reader.readAsText(file, 'windows-1252');
}`,
`async function handleFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.csv'));
  if (files.length === 0) {
    showAlert('Aviso', 'Nenhum arquivo .CSV válido selecionado.', 'warning');
    return;
  }

  toggleLoading(true);
  state.files = [];
  state.activeIndex = 0;

  try {
    for (const file of files) {
      const content = await readFileAsText(file, 'windows-1252');
      const baseName = file.name.replace(/\\.[^/.]+$/, "");
      const processed = processCsv(content, baseName);
      if (processed) {
        state.files.push(processed);
      }
    }

    if (state.files.length > 0) {
      renderApp();
    }
  } catch (e) {
    showAlert('Erro', 'Falha ao ler os arquivos selecionados.', 'error');
  } finally {
    toggleLoading(false);
  }
}

function readFileAsText(file, encoding) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsText(file, encoding);
  });
}

function renderApp() {
  if (state.files.length === 0) return;
  const activeFile = state.files[state.activeIndex];

  renderTabs();
  renderMapping(activeFile.columns);
  renderPreview(activeFile.columns, activeFile.rows);

  countRows.textContent = activeFile.rows.length;
  countColumns.textContent = activeFile.columns.length;

  mappingSection.classList.remove('hidden');
  previewSection.classList.remove('hidden');
}

function renderTabs() {
  if (!fileTabsContainer) return;
  fileTabsContainer.innerHTML = '';

  if (state.files.length <= 1) return;

  state.files.forEach((f, idx) => {
    const btn = document.createElement('button');
    btn.className = \`tab-btn \${idx === state.activeIndex ? 'active' : ''}\`;
    btn.textContent = f.originalFileName;
    btn.addEventListener('click', () => {
      state.activeIndex = idx;
      renderApp();
    });
    fileTabsContainer.appendChild(btn);
  });
}`
);

// Process CSV
code = code.replace(
`function processCsv(content) {
  const parsed = parseDelimitedCsv(content, ';');
  if (parsed.length < 2) {
    showAlert('Erro', 'O arquivo possui muito poucas linhas ou não está no formato delimitado por ";".', 'error');
    return;
  }`,
`function processCsv(content, originalFileName) {
  const parsed = parseDelimitedCsv(content, ';');
  if (parsed.length < 2) {
    showAlert('Erro', 'O arquivo possui muito poucas linhas ou não está no formato delimitado por ";".', 'error');
    return null;
  }`
);

code = code.replace(
`  state.rows = transformed;
  state.columns = exportColumns;

  renderMapping(exportColumns);
  renderPreview(exportColumns, transformed);

  countRows.textContent = transformed.length;
  countColumns.textContent = exportColumns.length;

  mappingSection.classList.remove('hidden');
  previewSection.classList.remove('hidden');
}`,
`  return { originalFileName, rows: transformed, columns: exportColumns };
}`
);

// downloadCsvBtn
code = code.replace(
`downloadCsvBtn.addEventListener('click', () => {
  if (!state.rows.length) return;
  const csv = buildCsv(state.columns, state.rows);
  downloadFile(csv, 'relatorio_final.csv', 'text/csv;charset=utf-8;');
});`,
`downloadCsvBtn.addEventListener('click', async () => {
  if (!state.files.length) return;

  if (state.files.length === 1) {
    const activeFile = state.files[0];
    const csv = buildCsv(activeFile.columns, activeFile.rows);
    downloadFile(csv, \`\${activeFile.originalFileName}_final.csv\`, 'text/csv;charset=utf-8;');
  } else {
    toggleLoading(true);
    try {
      const zip = new JSZip();
      for (const file of state.files) {
        const csv = buildCsv(file.columns, file.rows);
        zip.file(\`\${file.originalFileName}_final.csv\`, csv);
      }
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Relatorios_CSV_Final.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch(e) {
      showAlert('Erro', 'Falha ao criar o arquivo ZIP (CSV).', 'error');
    }
    toggleLoading(false);
  }
});`
);

// downloadExcelBtn
let excelBtnMatch = code.match(/downloadExcelBtn\.addEventListener\('click', async \(\) => {([\s\S]*?)function processCsv/);
let excelInner = excelBtnMatch[1];
// inside excelInner:
let newExcelInner = excelInner.replace(/if \(!state\.rows\.length\) return;/, 'if (!state.files.length) return;');
newExcelInner = newExcelInner.replace(
`    // 2. Calcular DATA Mínima e Máxima para o Nome do Arquivo - à prova de erros cross-format`,
`    const generateExcelBlob = async (fileObj) => {
    // 2. Calcular DATA Mínima e Máxima para o Nome do Arquivo - à prova de erros cross-format`
);
newExcelInner = newExcelInner.replace(/state\.rows/g, "fileObj.rows");
newExcelInner = newExcelInner.replace(/state\.originalFileName/g, "fileObj.originalFileName");
newExcelInner = newExcelInner.replace(/state\.columns/g, "fileObj.columns");

// Replace export action inside generating workbook
newExcelInner = newExcelInner.replace(
`    // Exportação em formato Buffer compatível com FileSaver nativo via Blob
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);`,
`    // Exportação em formato Buffer compatível com FileSaver nativo via Blob
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return { blob, fileName: finalFileName };
    };

    if (state.files.length === 1) {
      const { blob, fileName } = await generateExcelBlob(state.files[0]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      const zip = new JSZip();
      for (const f of state.files) {
        const { blob, fileName } = await generateExcelBlob(f);
        zip.file(fileName, blob);
      }
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Relatorios_Excel_Final.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }`
);

code = code.replace(excelInner, newExcelInner);

fs.writeFileSync('w:\\\\FABIANO\\\\PROGRAMAÇÃO\\\\SISTEMA DE RELATÓRIO\\\\script.js', code);
console.log("Refactoring applied successfully!");
