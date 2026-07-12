const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Notification = require('../models/Notification');

/**
 * @desc    Get notifications for the current user (includes broadcast notifications)
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const filter = {
    $or: [{ recipient: req.user._id }, { recipient: null }],
  };
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);

  res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

/**
 * @desc    Mark all of the current user's notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { $or: [{ recipient: req.user._id }, { recipient: null }], isRead: false },
    { isRead: true }
  );
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (Admin)
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
