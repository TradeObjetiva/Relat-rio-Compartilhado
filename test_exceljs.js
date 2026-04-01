const ExcelJS = require('exceljs');

async function test() {
try {
    const finalFileName = 'test.xlsx';
    const state = { columns: ['A', 'B'], rows: [{A: '1', B: '2'}] };
    const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; 
    
    // 3. Montar Arquivo via ExcelJS
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Relatório Semanal', {
      views: [{ showGridLines: false }]
    });

    const imageId = wb.addImage({
      base64: LOGO_BASE64,
      extension: 'png',
    });
    
    ws.mergeCells(1, 1, 2, 2); 
    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.1 }, 
      ext: { width: 140, height: 45 }
    });

    const endColIndex = Math.max(state.columns.length, 4);
    ws.mergeCells(1, 3, 2, endColIndex);
    
    const titleCell = ws.getCell(1, 3);
    titleCell.value = "RELATÓRIO SEMANAL";
    titleCell.font = { name: "Aptos Narrow", size: 28, bold: true, color: { argb: "FF000000" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    ws.getRow(1).height = 25;
    ws.getRow(2).height = 25;

    const headerRow = ws.getRow(3);
    state.columns.forEach((colName, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = colName;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE26B0A' } };
      cell.font = { name: "Aptos Narrow", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: 'thin', color: { argb: "FF000000" } }, right: { style: 'thin', color: { argb: "FF000000" } },
        bottom: { style: 'thin', color: { argb: "FF000000" } }, left: { style: 'thin', color: { argb: "FF000000" } }
      };
    });

    state.rows.forEach((row, rowIdx) => {
      const dbRow = ws.getRow(rowIdx + 4); 
      const isOdd = rowIdx % 2 !== 0; 
      const bgColor = isOdd ? 'FFFCE4D6' : 'FFF8CBAB';

      state.columns.forEach((colName, colIdx) => {
        const cell = dbRow.getCell(colIdx + 1);
        cell.value = row[colName] ?? '';
        cell.font = { name: "Aptos Narrow", size: 10, color: { argb: "FF000000" } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: "FF000000" } }, right: { style: 'thin', color: { argb: "FF000000" } },
          bottom: { style: 'thin', color: { argb: "FF000000" } }, left: { style: 'thin', color: { argb: "FF000000" } }
        };
      });
    });

    ws.autoFilter = {
      from: { row: 3, column: 1 },
      to: { row: state.rows.length + 3, column: state.columns.length }
    };

    const buffer = await wb.xlsx.writeBuffer();
    console.log("Success with ExcelJS!");
  } catch (e) {
    console.error("error", e);
  }
}
test();
