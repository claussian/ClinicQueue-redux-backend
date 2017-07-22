import express from 'express';
import clinicController from '../controller/clinics';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads/' });

const router = express.Router();

router.get('/',clinicController.getClinic);
router.post('/post', clinicController.postClinic);

module.exports = router;
