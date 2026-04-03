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

        // Fix old hook-specific direct imports that were not caught
        newContent = newContent.replace(/from "@\/hooks\/useSystemConfig"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useGroup"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useMenus"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useNavigation"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useUserNavigation"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useSeo"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useModal"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useToast"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useSerialNumber"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useUrlApiSync"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useUrlListSync"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/usePagination"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useApiFetch"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useLazyDataLoader"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useFormValidation"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useUpload"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useTableSelection"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useAuthInit"/g, 'from "@/hooks"');
        newContent = newContent.replace(/from "@\/hooks\/useUserManagement"/g, 'from "@/hooks"');

        // Fix showSuccess / showError usage → toast.success / toast.error
        // Pattern: const { ..., showSuccess, showError, ... } = useListPage(...)
        // We need to add toast to destructuring and replace calls
        if (newContent.includes('showSuccess') || newContent.includes('showError')) {
          // Replace destructuring: add toast if showSuccess/showError present
          newContent = newContent.replace(/,\s*showSuccess,\s*showError/g, ', toast');
          newContent = newContent.replace(/,\s*showSuccess/g, ', toast');
          newContent = newContent.replace(/showSuccess\s*,\s*showError/g, 'toast');
          newContent = newContent.replace(/showSuccess,/g, 'toast,');
          newContent = newContent.replace(/showError,/g, '');
          // Replace calls
          newContent = newContent.replace(/\bshowSuccess\(/g, 'toast.success(');
          newContent = newContent.replace(/\bshowError\(/g, 'toast.error(');
        }

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      }
    });
  }
});
console.log('Done');
