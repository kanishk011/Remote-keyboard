import pool from '../../db.js';

const controlTimeout = 120;

// Get query whos is taken the control 
const getControl = async () => {
  const [control] = await pool.query('select * from control_state where id = 1');
  return control[0];
};

// Check the time difference between who is acquired last
const isTimedOut = (acquiredAt) => {
  if (!acquiredAt) return false;
  const diffSeconds = (new Date() - new Date(acquiredAt)) / 1000;
  return diffSeconds > controlTimeout;
};

// update the control user id
const releaseControl = async () => {
  await pool.query('update control_state set user_id = null, acquired_at = null where id = 1');
};


// get the current keyboard state pooling happends
export const getKeyboardState = async () => {
  const [keys] = await pool.query('select * from keyboard_state order by key_id');
  const control = await getControl();

  if (control.user_id && isTimedOut(control.acquired_at)) {
    await releaseControl();
    control.user_id = null;
    control.acquired_at = null;
  }

  return {
    keys,
    control: {
      userId: control.user_id,
      acquiredAt: control.acquired_at
    }
  };
};

// take the control of the keyboard with checking time logic
export const takeControl = async (userId) => {
  const control = await getControl();

  if (control.user_id && !isTimedOut(control.acquired_at)) {
    return {
      success: false,
      message: 'Control is already taken',
      currentUser: control.user_id
    };
  }

  await pool.query('update control_state set user_id = ?, acquired_at = now() where id = 1', [userId]);
  return { success: true, message: 'Control acquired' };
};

// Toggle the key by user id with time logic check
export const toggleKey = async (keyId, userId) => {
  const control = await getControl();

  if (control.user_id !== userId) {
    return { success: false, message: 'You do not have control' };
  }

  // After time check release the control make null 
  if (isTimedOut(control.acquired_at)) {
    await releaseControl();
    return { success: false, message: 'Control timed out' };
  }

  
  const [key] = await pool.query('select * from keyboard_state where key_id = ?', [keyId]);

  let newColor, newLitBy;
  if (key[0].color === 'white') {
    newColor = userId === 1 ? 'red' : 'yellow';
    newLitBy = userId;
  } else {
    newColor = 'white';
    newLitBy = null;
  }

  await pool.query('update keyboard_state set color = ?, lit_by = ? where key_id = ?', [newColor, newLitBy, keyId]);
  await releaseControl();

  return { success: true, message: 'Key toggled', color: newColor };
};
