import express from 'express';
import queueController from '../controller/queue';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads/' });

const router = express.Router();

/* GET polyclinics JSON */
router.get('/', queueController.getAllQueue);
router.post('/:clinic_id', upload.single('pic'), queueController.postQueue);
router.delete('/:queue_id', queueController.deleteQueue);

module.exports = router;
