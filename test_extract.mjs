import fs from 'fs';

// Read App.tsx
const code = fs.readFileSync('src/App.tsx', 'utf8');

// We'll extract only the generatePowerShellScript body and its dependencies roughly
const regex = /const generatePowerShellScript = \(\) => \{([\s\S]*?)return `param\(\)\\n([\s\S]*?)`;\n  };\n\n  const generateBatchScript/m;
const match = code.match(regex);

if (match) {
    let scriptContent = match[2];
    
    // Evaluate standard template vars to strings for parsing check
    scriptContent = scriptContent.replace(/\$\{([^}]+)\}/g, "DUMMY");
    
    fs.writeFileSync('Install_Test.ps1', "param()\n" + scriptContent);
    console.log("Mock saved!");
} else {
    console.log("Regex missed text");
}
