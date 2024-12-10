const glob = require('glob');
const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

const inputDir = 'dist';
const outputDir = 'dist';

// البحث عن جميع ملفات .js في dist والمجلدات الفرعية
glob(`${inputDir}/**/*.js`, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      minify(data, {
        compress: true,
        mangle: true
      }).then(result => {
        if (result.error) {
          console.error('Error minifying file:', result.error);
          return;
        }

        // إنشاء مسار المجلد الفرعي في outputDir
        const outputFile = path.join(outputDir, path.relative(inputDir, file));
        const outputDirPath = path.dirname(outputFile);

        // التأكد من وجود المجلد الفرعي
        fs.mkdirSync(outputDirPath, { recursive: true });

        // كتابة الملف المضغوط
        fs.writeFile(outputFile, result.code, 'utf8', err => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }

          console.log(`Minified ${file} to ${outputFile}`);
        });
      }).catch(err => {
        console.error('Error minifying file:', err);
      });
    });
  });
});
