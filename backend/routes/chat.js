const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Request = require('../models/Request');

// Get all conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Sync logic: Find accepted requests that don't have a conversation yet
    const acceptedRequests = await Request.find({
      $or: [{ studentId: userId }, { alumniId: userId }],
      status: "Accepted"
    });

    for (const request of acceptedRequests) {
      // Robust casting for $all query
      const sId = new mongoose.Types.ObjectId(request.studentId);
      const aId = new mongoose.Types.ObjectId(request.alumniId);

      const existingConvo = await Conversation.findOne({
        participants: { $all: [sId, aId] }
      });

      if (!existingConvo) {
        await Conversation.create({
          participants: [sId, aId]
        });
        console.log(`Created new conversation for ${sId} and ${aId}`);
      }
    }

    console.log("Fetching conversations for user:", userId);
    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    })
    .populate('participants', 'name email role _id')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    console.log("Found conversations:", conversations.length);
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching/syncing conversations:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a specific conversation
router.get('/messages/:convoId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.convoId
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new conversation or get existing between two users
router.post('/conversation', auth, async (req, res) => {
  const { receiverId } = req.body;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    }).populate('participants', 'name email role _id');
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId]
      });
      conversation = await conversation.populate('participants', 'name email role _id');
    }
    
    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a message via REST
router.post('/message', auth, async (req, res) => {
  const { conversationId, text } = req.body;
  try {
    const newMessage = await Message.create({
      conversationId,
      sender: req.user.id,
      text
    });
    
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id
    });
    
    await newMessage.populate('sender', 'name email');
    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
