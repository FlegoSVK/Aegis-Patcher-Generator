const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /return `param\(\)([\s\S]*?)`;\n  };\n\n  const generateBatchScript/m;
const match = regex.exec(content);
if (match) {
    fs.writeFileSync('Install.ps1', "param()" + match[1]);
    console.log("Saved Install.ps1, size:", match[1].length);
} else {
    console.log("Regex failed");
}
