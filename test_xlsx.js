const XLSX = require('xlsx-js-style');

try {
  const finalFileName = `test.xlsx`;
  const state = { columns: ['A', 'B'], rows: [{A: '1', B: '2'}] };
  const wsData = [];
  
  wsData.push(["RELATÓRIO SEMANAL"]);
  wsData.push([]); 

  const merges = [
    { s: {r: 0, c: 0}, e: {r: 1, c: state.columns.length - 1} }
  ];

  wsData.push(state.columns);

  state.rows.forEach(row => {
    const rowArr = state.columns.map(col => row[col] ?? '');
    wsData.push(rowArr);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!merges'] = merges;
  ws['!autofilter'] = { ref: `A3:${XLSX.utils.encode_col(state.columns.length - 1)}${wsData.length}` };

  const titleStyle = {
    font: { bold: true, sz: 28, name: "Arial", color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 10 },
    fill: { fgColor: { rgb: "E26B0A" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }
    }
  };

  const dataStyleOdd = { // Pêssego Lighter
    font: { name: "Arial", sz: 10, color: { rgb: "000000" } },
    fill: { fgColor: { rgb: "FCE4D6" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }
    }
  };
  
  const dataStyleEven = { // Pêssego / Laranja Pouco mais escuro
    font: { name: "Arial", sz: 10, color: { rgb: "000000" } },
    fill: { fgColor: { rgb: "F8CBAB" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }
    }
  };

  for (const cellAddress in ws) {
    if (cellAddress[0] === '!') continue; 
    
    const addrCoords = XLSX.utils.decode_cell(cellAddress); 
    
    if (addrCoords.r === 0 || addrCoords.r === 1) { 
      ws[cellAddress].s = titleStyle;
    } else if (addrCoords.r === 2) { 
      ws[cellAddress].s = headerStyle;
    } else { 
      ws[cellAddress].s = (addrCoords.r % 2 === 0) ? dataStyleEven : dataStyleOdd;
    }
  }

  const colWidths = state.columns.map(col => {
    let maxLen = col.length + 5;
    for(let i = 0; i < Math.min(50, state.rows.length); i++) {
        const val = String(state.rows[i][col] ?? '');
        if(val.length > maxLen) maxLen = val.length;
    }
    return { wch: Math.min(maxLen + 2, 60) }; 
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, finalFileName);
  console.log("Success");
} catch(e) {
  console.error("FAIL", e);
}
