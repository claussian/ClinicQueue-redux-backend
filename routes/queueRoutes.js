import express from 'express';
import queueController from '../controller/queues';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
// multer puts the image file in temporary storage folder called "uploads" and attaches the path in req.file.path
const upload = multer({ dest: './uploads' });

const router = express.Router();

router.get('/', queueController.getAllQueue);

router.get('/:id', queueController.getQueue);

router.post('/', upload.single('pic'), queueController.postQueue);

router.delete('/:queue_id', queueController.deleteQueue);



module.exports = router;
