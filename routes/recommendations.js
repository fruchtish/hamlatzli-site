const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/recommendations
// @desc    Get all recommendations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .populate('user', ['username']);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת');
  }
});

// @route   GET api/recommendations/:id
// @desc    Get recommendation by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('user', ['username'])
      .populate('comments.user', ['username']);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    res.json(recommendation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    res.status(500).send('שגיאת שרת');
  }
});

// @route   POST api/recommendations
// @desc    Create a recommendation
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, rating } = req.body;

  try {
    const newRecommendation = new Recommendation({
      title,
      description,
      category,
      rating,
      user: req.user.id
    });

    const recommendation = await newRecommendation.save();
    res.json(recommendation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת');
  }
});

// @route   PUT api/recommendations/:id
// @desc    Update a recommendation
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, rating } = req.body;

  try {
    let recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    // Check if user owns the recommendation
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'אין הרשאה' });
    }
    
    recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, category, rating } },
      { new: true }
    );
    
    res.json(recommendation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    res.status(500).send('שגיאת שרת');
  }
});

// @route   DELETE api/recommendations/:id
// @desc    Delete a recommendation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    // Check if user owns the recommendation or is admin
    const user = await User.findById(req.user.id);
    if (recommendation.user.toString() !== req.user.id && !user.isAdmin) {
      return res.status(401).json({ msg: 'אין הרשאה' });
    }
    
    await recommendation.remove();
    res.json({ msg: 'ההמלצה הוסרה' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    res.status(500).send('שגיאת שרת');
  }
});

// @route   POST api/recommendations/:id/comment
// @desc    Add a comment to a recommendation
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  try {
    const recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    const newComment = {
      text,
      user: req.user.id
    };
    
    recommendation.comments.unshift(newComment);
    await recommendation.save();
    
    // Populate user info for the new comment
    await recommendation.populate('comments.user', ['username']).execPopulate();
    
    res.json(recommendation.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    res.status(500).send('שגיאת שרת');
  }
});

// @route   POST api/recommendations/:id/like
// @desc    Like a recommendation
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    recommendation.likes += 1;
    await recommendation.save();
    
    res.json({ likes: recommendation.likes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    res.status(500).send('שגיאת שרת');
  }
});

module.exports = router;
