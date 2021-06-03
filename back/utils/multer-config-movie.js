const multerMovie = require('multer');

const MIME_TYPES = {
    'movie/mp4' : 'mp4'
}

const storage = multerMovie.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'movies')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multerMovie({storage: storage}).single('movie');


//  const MIMES_TYPE = {
//     'movie/mp4' : 'mp4'
// }

// const storages = multer.diskStorage({
//     destination: (req, movie, callback) => {
//         callback(null, 'movies')
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIMES_TYPE[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension)
//     }
// });

// module.exports = multer({storage: storages}).any('movie');


