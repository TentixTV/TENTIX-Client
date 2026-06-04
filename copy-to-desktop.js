const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'dist', 'TENTIX Client Setup.exe');
const dest = path.join(__dirname, '..', '..', 'TENTIX Client Setup.exe');

if (fs.existsSync(src)) {
    try {
        fs.copyFileSync(src, dest);
        console.log('Successfully copied "TENTIX Client Setup.exe" to Desktop!');
    } catch (err) {
        console.error('Error copying file to Desktop:', err);
    }
} else {
    console.error('Built installer not found at:', src);
}
