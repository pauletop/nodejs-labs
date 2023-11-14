const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'public/cloud/' }); // declare destination of uploaded files
const archiver = require('archiver');
const { response } = require('express');
var subPath = [];
router.get('/', function(req, res){
    if (!req.session.loggedin){
        res.redirect('/login');
        return;
    }
    res.render('index');
});
router.post("/createTxt", (req, res) => {
    let title = req.body.title,
        content = req.body.content;
    console.log(req.body);
    // create new file with title and content
    title = title.replace(/ /g, '_'); // replace all spaces with underscore
    // if file exists, return error
    if (fs.existsSync(`./public/cloud/${subPath.join('/')}/${title}.txt`)) {
        res.status(400).json({ message: 'File name already exists!' });
        return;
    }

    fs.writeFile(`./public/cloud/${subPath.join('/')}/${title}.txt`, content, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.status(200).json({ stat: true, message: `File ${title}.txt created successfully!` }); 
    });
});
router.post("/createFolder", (req, res) => {
    let title = req.body.title;

    // if folder exists, return error
    if (fs.existsSync(`./public/cloud/${subPath.join('/')}/${title}`)) {
        res.status(400).json({ stat: false, message: 'Folder name already exists!' });
        return;
    }
    fs.mkdir(`./public/cloud/${subPath.join('/')}/${title}`, function (err) {
        if (err) throw err;
        console.log('Folder created!');
        res.status(200).json({ stat: true, message: `Folder ${title} created successfully!` });
    });
});
router.delete("/delete/:item", (req, res) => {
    let item = req.params.item,
        stat = fs.statSync(`./public/cloud/${subPath.join('/')}/${item}`);
    if (stat.isDirectory()) {
        fs.rmdir(`./public/cloud/${subPath.join('/')}/${item}`, function (err) {
            if (err) {
                console.error(err);
                res.status(400).json({ stat: false, message: 'Error! Please try again later!' });
            } else {
                console.log('Folder deleted!');
                res.status(200).json({ stat: true, message: `Folder ${item} deleted successfully!` });
            }
        });
    } else {
        // delete file forever
        fs.unlink(`./public/cloud/${subPath.join('/')}/${item}`, function (err) {
            if (err) {
                console.error(err);
                res.status(400).json({ stat: false, message: 'Error! Please try again later!' });
            } else {
                console.log('File deleted!');
                res.status(200).json({ stat: true, message: `File ${item} deleted successfully!` });
            }
        });
    }
});
router.post("/redirect", (req, res) => {
    let itemName = req.body.itemName,
        type = req.body.type,
        keyword = req.body.keyword;
    if (itemName === null){
        type = 'dir';
    } else {
        subPath.push(itemName);
    }
    if (type === 'dir') {
        var folders = [],
        fileArr = [];
        // get all items in folder and separate files and folders with size, type and last modified date
        fs.readdir(`./public/cloud/${subPath.join('/')}`, function (err, items) {
            if (err) {
                res.status(400).json({ message: 'Error! Please try again later!' });
                return;
            }
            let typeMap = {
                txt: "Text Document",
                zip: "Compressed File",
                rar: "Compressed File",
                json: "JSON Source File",
                js: "JavaScript File",
                docx: "Microsoft Word Document",
                xlsx: "Microsoft Excel Document",
                pptx: "Microsoft PowerPoint Document"
            }
            items.forEach(item => {
                let stats = fs.statSync(`./public/cloud/${subPath.join('/')}/${item}`);
                if (stats.isDirectory()) {
                    folders.push({
                        name: item,
                        size: '-',
                        type: 'Folder',
                        lastModified: stats.mtime.toLocaleDateString()
                    });
                } else {
                    let ext = path.extname(item).substring(1)
                    fileArr.push({
                        name: item,
                        size: stats.size,
                        type: typeMap[ext] || ext.toUpperCase() + ' File',
                        lastModified: stats.mtime.toLocaleDateString()
                    });
                }
            });
            // search by keyword
            if (keyword !== null && itemName === null){
                let folderArr = [],
                    fileArr = [];
                folders.forEach(folder => {
                    if (folder.name.toLowerCase().includes(keyword.toLowerCase())){
                        folderArr.push(folder);
                    }
                });
                fileArr.forEach(file => {
                    if (file.name.toLowerCase().includes(keyword.toLowerCase())){
                        fileArr.push(file);
                    }
                });
                res.status(200).json({ folders: folderArr, files: fileArr, path: subPath });
                return;
            }
            res.status(200).json({ folders: folders, files: fileArr, path: subPath });
        });
    } else if (type === 'file') {
        // read file's content
        let ext = path.extname(itemName).substring(1);
        // if image files
        if ( ext === 'ico' || ext === 'pdf' || ext === 'tif' || ext === 'psd' || ext === 'zip' || ext === 'rar') {
            res.status(200).json({ stat:"err", content: "App is not supported to read this file!", path: subPath });
            return;
        }
        // response image with blob to client
        if (ext === 'png' || ext === 'jpg' || ext === 'webp' || ext === 'jpeg' || ext === 'gif' || ext === 'svg' 
        || ext === 'bmp'){
            if (ext === "svg"){
                ext = "svg+xml";
            }
            fs.readFile(`./public/cloud/${subPath.join('/')}`, function (err, data) {
                if (err) {
                    subPath.pop();
                    res.status(400).json({ message: 'Error! Please try again later!' });
                    return;
                }
                let base64Data = data.toString('base64');
                res.status(200).json({ content: base64Data, type: `image/${ext}`, path: subPath });
            });
            return;
        }
        fs.readFile(`./public/cloud/${subPath.join('/')}`, 'utf8', function (err, data) {
            if (err) {
                res.status(400).json({ message: 'Error! Please try again later!' });
                return;
            }
            res.status(200).json({ content: data, path: subPath });
        });
    } else {
        res.status(400).json({ message: 'Error! Something went wrong!' });
    }
});
router.post("/back/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);
    while (id < 0) {
        subPath.pop();
        id++;
    }
    res.status(200).json({ stat: true, message: 'Back successfully!' });
});
router.post("/upload", upload.single('file'), (req, res) => {
    // get data from ajax request form data
    let file = req.file;
    if (path.extname(file.originalname) === '.exe' || path.extname(file.originalname) === '.msi' 
        || path.extname(file.originalname) === '.bat' || path.extname(file.originalname) === '.sh') {
        res.status(400).json({ stat: false, message: 'File type is not supported!' });
        return;
    }
    // if file exists, return error
    if (fs.existsSync(`./public/cloud/${subPath.join('/')}/${file.originalname}`)) {
        res.status(400).json({ stat: false, message: 'File name already exists!' });
        return;
    }
    // move file to destination
    fs.renameSync(`./public/cloud/${file.filename}`, `./public/cloud/${subPath.join('/')}/${file.originalname}`);
    res.status(200).json({ stat: true, message: 'Upload successfully!' });
});
router.post("/rename", (req, res) => {
    let oldName = req.body.oldName,
        newName = req.body.newName,
        type = req.body.type;
    console.log(req.body);
    // if file exists, return error
    if (fs.existsSync(`./public/cloud/${subPath.join('/')}/${newName}`)) {
        res.status(400).json({ stat: false, message: 'File name already exists!' });
        return;
    }
    if (type === 'dir') {
        // if the folder contains the file, return error
        if (fs.readdirSync(`./public/cloud/${subPath.join('/')}/${oldName}`).length > 0) {
            res.status(400).json({ stat: false, message: 'Cannot rename the folder that not empty!' });
            return;
        }
    }
    fs.renameSync(`./public/cloud/${subPath.join('/')}/${oldName}`, `./public/cloud/${subPath.join('/')}/${newName}`);
    res.status(200).json({ stat: true, message: 'Rename successfully!' });
});
router.post("/download", (req, res) => {
    let item = req.body.item,
        type = req.body.type;
    if (type === 'dir') {
        // zip folder
        const output = fs.createWriteStream(`./public/cloud/${subPath.join('/')}/${item}.zip`);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            // response zip with blob to client
            // res.status(200).json({ stat: true, message: 'Download successfully!', path: subPath });
            res.download(`./public/cloud/${subPath.join('/')}/${item}.zip`, item + '.zip', function (err) {
                if (err) {
                    console.error(err);
                    res.status(400).json({ stat: false, message: 'Error! Please try again later!' });
                }
            });
        });
        archive.on('error', function (err) {
            throw err;
        });
        archive.pipe(output);
        archive.directory(`./public/cloud/${subPath.join('/')}/${item}`, false);
        archive.finalize();
        return;
    }
    res.download(`./public/cloud/${subPath.join('/')}/${item}`, item, function (err) {
        if (err) {
            console.error(err);
            res.status(400).json({ stat: false, message: 'Error! Please try again later!' });
        }
    });
});

// router.post('/', upload);


module.exports = router;