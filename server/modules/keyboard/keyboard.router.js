import { Router } from 'express';
import * as keyboardController from './keyboard.controller.js';
import { validateTakeControl, validateToggleKey } from './keyboard.dto.js';

const router = Router();

router.get('/', keyboardController.getKeyboard);
router.post('/control/take', validateTakeControl, keyboardController.takeControl);
router.post('/key/toggle', validateToggleKey, keyboardController.toggleKey);

export default router;
