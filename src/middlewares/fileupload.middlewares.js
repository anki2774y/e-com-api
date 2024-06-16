// 1. Import multer 
import multer from "multer";

// 2. Configure storage with filename and location.

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(
            null, 
            './uploads'
        );
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');   // Replace ':' with '-'
        cb(
            null, 
            date + file.originalname
        );
    }
})

export const upload = multer({storage: storage});