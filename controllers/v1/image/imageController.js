const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');
var config = require('../../../config/firebase/config.js')
const { format } = require('util')
var path = require('path');

const storage = new googleStorage.Storage({
    projectId: config.PROJECT_ID,
    keyFilename: 'firebase-adminsdk.json'
});
const bucket = storage.bucket(config.BUCKET_ADDRESS);
const memory = Multer.memoryStorage()
const multer = Multer({
    storage: memory,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        console.log("multer",file.mimetype)
        if(!(config.FORMAT.includes(ext))) {
            return callback(new Error('jpeg allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: config.FILE_SIZE // no larger than 1mb, you can change as needed.
    }
});
const multerFilter = multer.single(config.ARGUMENT);

const ImageUploader = (req, res, next) => {

    multerFilter (req, res, async function(err) {

        if (err) {
            console.log("cs " + err);
            res.status(403).send({
                "message": err.message
            })
            return
        }
        let file = req.file;
        if (file) {
            try {
                let userId = null;

                if( req.owner )  userId = req.owner.userId;
                else if (req.asset)  userId = req.asset.id;
                if ( userId != null ) {
                    const response = await FirebaseUploader(file, userId);
                    req.file_name = response
                    console.log(response)
                    req.body.file = response
                    next()
                }
                else {
                    res.status(403).send("User Not provided")
                }
                // next(response)
            } catch (error) {
                console.error(error);
                res.status(403).send(error);
            }
        }
    })
}

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const FirebaseUploader = (file,owner_id) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        // let newFileName = `${Date.now()}_${file.originalname}`;

        let newFileName = `${parseInt(Date.now()/1000)}_${owner_id}${path.extname(file.originalname)}`
        console.log("newFileName", newFileName)
        let fileUpload = bucket.file(newFileName);
        var mimetype = file.mimetype
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.log(error);
            reject(error);
        });

        blobStream.on('finish', async() => {
            await fileUpload.makePublic();
            // The public URL can be used to directly access the file via HTTP.
            const signedUrls = await fileUpload.getSignedUrl({
                action: 'read',
                expires: config.EXP_DATE,
                content_type:mimetype
            })
            console.log("singedUrls",signedUrls[0])
            const url = format(`${config.URL_PREFIX}${bucket.name}/${fileUpload.name}`);
            resolve({
                url:url,
                filename:newFileName
            })
        });
        blobStream.end(file.buffer);
    });
}

const FirebaseImageRemove = (fileName) =>{
    return new Promise((resolve, reject) => {
        bucket.file(fileName).delete().then(response=>{
            if(response[0].statusCode === 204)
            {
                resolve("File Deleteed")
            }
            reject("File not deleted")
        }).catch(error=>{
            process.env.NODE_ENV != "production" ? console.error("FIREBASE_IMAGE_REMOVE",error.errors) : null;
            // resolve("done")
            reject(
                process.env.NODE_ENV != "production" ? error.errors: "File not deleted"
            )
        })
    });
}

module.exports = {
    ImageUploader: ImageUploader,
    FirebaseUploader,
    FirebaseImageRemove
}