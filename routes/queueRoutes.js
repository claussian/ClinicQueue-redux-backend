import express from 'express';
import queueController from '../controller/queues';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads' });

const router = express.Router();

router.get('/', queueController.getAllQueue);

router.get('/:id', queueController.getQueue);

// router.post('/:clinic_id', upload.single('pic'), queueController.postQueue);
router.delete('/:queue_id', queueController.deleteQueue);

router.post('/', upload.single('pic'), queueController.postQueue);

module.exports = router;
