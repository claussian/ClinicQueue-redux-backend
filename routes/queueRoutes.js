import express from 'express';
import queueController from '../controller/queues';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads/' });

const router = express.Router();

router.get('/', queueController.getAllQueue);
// router.post('/:clinic_id', upload.single('pic'), queueController.postQueue);
router.delete('/:queue_id', queueController.deleteQueue);


// router.get('/all', (req,res)=> {
//   queueController.getAllQueue((queues) => {
//     res.json(queues);
//   });
// });

router.post('/post', upload.single('pic'), (req,res)=> {
  queueController.getAllQueue(req, (queues) => {
    res.json(queues);
  });
});

module.exports = router;
