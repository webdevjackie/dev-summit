const fs = require("fs-extra");
const AdmZip = require("adm-zip");
const config = require("config");
fs.removeSync("dist");
const packageName = `${process.env.npm_package_name}-${config.get("Portal.release")}`;

if (fs.existsSync('./build')){
    fs.removeSync(packageName);
    fs.mkdirSync(packageName);

    // Adds individual files to dist/${packageName}.zip
    // Must contain full folder path of file. (src/myfile.txt)
    const filesToAdd = ['.gitignore', 'package.json', 'package-lock.json', 'README.md'];

    // Adds subfolder to dist/${packageName}.zip
    // If you need to exclude items, add files indivually from filesToAdd list
    const foldersToAdd = ['build', 'config','docs','public', 'scripts', 'src'];

    // Add Files to dist/${packageName}.zip
    const promises = [];
    if(filesToAdd !== undefined){
        filesToAdd.forEach(filename => {
            promises.push(fs.copy(filename,`${packageName}/${filename}`));
        });
    }

    if(foldersToAdd !== undefined){
        foldersToAdd.forEach(filename => {
            promises.push(fs.copy(filename,`${packageName}/${filename}`));
        });
    }

    Promise.all(promises).then(() => {
        const zip = new AdmZip();
        zip.addLocalFolder(packageName,packageName);
        fs.mkdirSync("dist");
        zip.writeZip(`dist/${packageName}.zip`);
        fs.removeSync(packageName);
    }, err => {
        console.error("There was an error copying files",err);
    });
} else {
    console.error("You must build the application before running the release script: npm run build");
}
