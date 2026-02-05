import * as keyboardService from './keyboard.service.js';

export const getKeyboard = async (req, res) => {
  try {
    const data = await keyboardService.getKeyboardState();
    // 200 - success
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const takeControl = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const result = await keyboardService.takeControl(userId);
    // 200 - success & 409 - conflict
    const status = result.success ? 200 : 409;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const toggleKey = async (req, res) => {
  try {
    const keyId = parseInt(req.body.keyId);
    const userId = parseInt(req.body.userId);
    const result = await keyboardService.toggleKey(keyId, userId);
    // 200 - success & 403 - forbidden
    const status = result.success ? 200 : 403;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
