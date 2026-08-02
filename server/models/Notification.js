import mongoose from 'mongoose';
import { getIO } from '../socket.js';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['NEW_USER', 'QUOTATION_SENT', 'NEW_ORDER', 'LOW_STOCK', 'NEW_INQUIRY'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

notificationSchema.post('save', function(doc) {
  try {
    const io = getIO();
    io.emit('newNotification', doc);
  } catch (error) {
    console.error('Socket.io emit error:', error.message);
  }
});

export default mongoose.model('Notification', notificationSchema);
