const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = ['src/components', 'src/app'];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // These files use useToastContext() which has showSuccess/showError, NOT toast.*
        // Fix: revert toast.success/toast.error back to showSuccess/showError
        // BUT ONLY in files that use useToastContext (not useListPage)
        const usesListPage = newContent.includes('useListPage') || newContent.includes('useAdminListPage');
        const usesToastContext = newContent.includes('useToastContext');

        if (!usesListPage && usesToastContext) {
          // Revert the bad replacements from tmp_fix2.js
          newContent = newContent.replace(/\btoas\.success\(/g, 'showSuccess(');
          newContent = newContent.replace(/\btoas\.error\(/g, 'showError(');
          newContent = newContent.replace(/\btoast\.success\(/g, 'showSuccess(');
          newContent = newContent.replace(/\btoast\.error\(/g, 'showError(');

          // Fix destructuring: replace  { toast } = useToastContext()
          // back to { showSuccess, showError } = useToastContext()
          newContent = newContent.replace(
            /const\s*\{\s*([^}]*),\s*toast\s*([^}]*)\}\s*=\s*useToastContext\(\)/g,
            (match, before, after) => `const { ${before}, showSuccess, showError${after} } = useToastContext()`
          );
          newContent = newContent.replace(
            /const\s*\{\s*toast\s*,\s*([^}]*)\}\s*=\s*useToastContext\(\)/g,
            (match, rest) => `const { showSuccess, showError, ${rest} } = useToastContext()`
          );
          newContent = newContent.replace(
            /const\s*\{\s*toast\s*\}\s*=\s*useToastContext\(\)/g,
            'const { showSuccess, showError } = useToastContext()'
          );
        }

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Fixed: ${filePath}`);
        }
      }
    });
  }
});
console.log('Done');
