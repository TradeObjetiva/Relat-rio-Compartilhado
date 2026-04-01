const fs = require('fs');
const imgPath = 'LOGO NOVA  OFICIAL HORIZONTAL.PNG';
const scriptPath = 'script.js';

try {
  const imgData = fs.readFileSync(imgPath);
  const base64Str = 'data:image/png;base64,' + imgData.toString('base64');
  
  let code = fs.readFileSync(scriptPath, 'utf8');
  
  // Encontra a constante e substitui pelo novo valor base64
  code = code.replace(/const LOGO_BASE64 = ".*?";/, 'const LOGO_BASE64 = "' + base64Str + '";');
  
  fs.writeFileSync(scriptPath, code);
  console.log('Base64 injetada com sucesso no script.js');
} catch (e) {
  console.error('Erro:', e);
}
