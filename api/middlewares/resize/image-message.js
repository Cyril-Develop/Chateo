const sharp = require('sharp');

const resize = (req, res, next) => {
    if (req.file) {
        sharp(req.file.path)
            .webp()
            .resize({
                width: 400
            })
            .toFile(`images/message/${req.file.filename}.webp`, (err, info) => {
                if (err) {
                    console.log('Error resizing image:', err);
                    return res.status(400).json({ error: 'Image not resized.' });
                };
                req.file.filename = req.file.filename + '.webp';
                next();
            });
    } else {
        next();
    }
};

module.exports = resize;