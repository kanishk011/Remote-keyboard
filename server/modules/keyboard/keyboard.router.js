import { Router } from 'express';
import * as keyboardController from './keyboard.controller.js';

const router = Router();

router.get('/', keyboardController.getKeyboard);
router.post('/control/take', keyboardController.takeControl);
router.post('/key/toggle', keyboardController.toggleKey);

export default router;
