import express from 'express';
import clinicsController from '../controller/clinics';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads/' });

const router = express.Router();

/* GET index page */
router.get('/', clinicsController.index);

/* GET login page */
router.get('/login', clinicsController.login);

/* GET signup page */
router.get('/signup', clinicsController.signup);

/* GET report page */
router.get('/report', clinicsController.report);

/* GET polyclinics JSON */
router.get('/load', clinicsController.listPoly);

/* GET private clinics JSON */
router.get('/loadPrivate', clinicsController.listPrivate);

/* GET polyclinic names JSON */
router.get('/loadPolyNames', clinicsController.listPolyNames);

/* GET private clinic names JSON */
router.get('/loadPrivateNames', clinicsController.listPrivateNames);

/* PUT private clinic photo */
router.put('/report', upload.single('photoInput'), clinicsController.updatePhoto);

module.exports = router;
