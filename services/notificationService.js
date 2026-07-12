const Notification = require('../models/Notification');

/**
 * Creates and persists a notification.
 * Pass recipient=null to create a broadcast/system-wide notification.
 */
const createNotification = async ({ recipient = null, title, message, type = 'General', relatedId = null }) => {
  return Notification.create({ recipient, title, message, type, relatedId });
};

module.exports = { createNotification };
