const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '.');


const CONFIG = {
    logEnabled: true
};

function log(textLog) {
    if(CONFIG.logEnabled) console.log(textLog);
}

function isDirectory(p) {
    return fs.lstatSync(p).isDirectory()
}

function isFile(p) {
    return fs.lstatSync(p).isFile()
}

function readdir(dirpath) {
    fs.readdir(dirpath, function (err, itens) {
        if (err) {
            log('Unable to scan directory: ' + err);
            return;
        }
    
        itens.forEach(function (item) {
            // let regexEditOnGithub = /^\[Edit on Github.*\.md\)$/gmi;
            let blackList = [
                '.forestry',
                '.git',
                '.github',
                '.gitignore',
                'front-matter-recursive-edit.js',
                'static'
            ];
    
            if(blackList.indexOf(item) !== -1) {
                log(`[INFO] ${item} configured into black list.`);
                return;
            }
    
            let path = `${dirpath}/${item}`;

            if(isDirectory(path)) {
                log(`[INFO] IS DIRECTORY: ${path}`);
                readdir(path);
            } else {
                log(`[INFO] IS FILE: ${path}`);

                let buffer = fs.readFileSync(path);
                let content = buffer.toString('utf-8');
                let text = '';
                
                text = content.replace(/^\[Edite no Github.*\.md\)$/gmi, '');

                fs.writeFileSync(path, text, 'utf-8');
            }
        });
    });
}

readdir(directoryPath);