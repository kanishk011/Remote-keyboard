// 400 - bad request


// Common - Validators

// validate userId
const validateUserId = (userId) => {
  if (!userId || isNaN(parseInt(userId))) {
    return 'userId is required and must be a number';
  }
  if (![1, 2].includes(parseInt(userId))) {
    return 'userId must be 1 or 2';
  }
  return null;
};

// validate keyId
const validateKeyId = (keyId) => {
  if (!keyId || isNaN(parseInt(keyId))) {
    return 'keyId is required and must be a number';
  }
  if (parseInt(keyId) < 1 || parseInt(keyId) > 10) {
    return 'keyId must be between 1 and 10';
  }
  return null;
};





// validate take control request
export const validateTakeControl = (req, res, next) => {
  const error = validateUserId(req.body.userId);
  if (error) return res.status(400).json({ success: false, message: error });

  req.body.userId = parseInt(req.body.userId);
  next();
};

// validate toggle key request
export const validateToggleKey = (req, res, next) => {
  const userError = validateUserId(req.body.userId);
  if (userError) return res.status(400).json({ success: false, message: userError });

  const keyError = validateKeyId(req.body.keyId);
  if (keyError) return res.status(400).json({ success: false, message: keyError });

  req.body.userId = parseInt(req.body.userId);
  req.body.keyId = parseInt(req.body.keyId);
  next();
};
