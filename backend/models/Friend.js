const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index to prevent duplicate friend requests
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Get user's friends
FriendSchema.statics.getFriends = async function(userId) {
  const friends = await this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  })
  .populate('requester', 'name email')
  .populate('recipient', 'name email');

  return friends.map(f => {
    if (f.requester._id.toString() === userId.toString()) {
      return { friend: f.recipient, status: f.status };
    }
    return { friend: f.requester, status: f.status };
  });
};

module.exports = mongoose.model('Friend', FriendSchema);
