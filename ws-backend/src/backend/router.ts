import { Router } from 'express';
import { 
    postUploadFiles,
    postUploadFile 
} from './controllers/fileController';

const router: Router = Router();

router.post('/upload-file', postUploadFile)
router.post('/upload-files', postUploadFiles)

export default router;