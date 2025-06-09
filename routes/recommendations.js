const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/recommendations/');
  },
  filename: function (req, file, cb) {
    cb(null, 'recommendation-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files (jpeg, png, gif) are allowed!';
    return cb(new Error('Only image files (jpeg, png, gif) are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route   GET api/recommendations
// @desc    Get all recommendations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .populate('user', ['username'])
      .populate('category', 'name hebrewName iconUrl');
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
      .populate('comments.user', ['username'])
      .populate('category', 'name hebrewName iconUrl');
    
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
router.post(
  '/',
  [
    auth,
    upload.single('image'),
    check('title', 'Title is required').not().isEmpty().trim().escape(),
    check('description', 'Description is required').not().isEmpty().trim().escape(),
    check('category', 'Category is required and must be a valid ID').isMongoId(),
    check('rating', 'Rating must be a number between 1 and 5').isNumeric().toFloat().custom(value => {
      if (value < 1 || value > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.fileValidationError) {
      return res.status(400).json({ errors: [{ msg: req.fileValidationError }] });
    }

    const { title, description, category, rating } = req.body;

    try {
      const newRecommendationData = {
      title,
      description,
      category,
      rating,
      user: req.user.id
    };

    if (req.file) {
      newRecommendationData.imageUrl = '/uploads/recommendations/' + req.file.filename;
    }

    const newRecommendation = new Recommendation(newRecommendationData);

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
router.put(
  '/:id',
  [
    auth,
    upload.single('image'),
    check('title', 'Title cannot be empty').optional().not().isEmpty().trim().escape(),
    check('description', 'Description cannot be empty').optional().not().isEmpty().trim().escape(),
    check('category', 'Category must be a valid ID').optional().isMongoId(),
    check('rating', 'Rating must be a number between 1 and 5').optional().isNumeric().toFloat().custom(value => {
      if (value < 1 || value > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.fileValidationError) {
      return res.status(400).json({ errors: [{ msg: req.fileValidationError }] });
    }

    const { title, description, category, rating } = req.body;

    try {
      let recommendation = await Recommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ msg: 'ההמלצה לא נמצאה' });
    }
    
    // Check if user owns the recommendation
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Not authorized' }] });
    }

    // Build object with fields to update
    const updateFields = {};
    if (req.body.hasOwnProperty('title')) updateFields.title = title;
    if (req.body.hasOwnProperty('description')) updateFields.description = description;
    if (req.body.hasOwnProperty('category')) updateFields.category = category;
    if (req.body.hasOwnProperty('rating')) updateFields.rating = rating;


    if (req.file) {
      // TODO: Delete old image if it exists and is different
      updateFields.imageUrl = '/uploads/recommendations/' + req.file.filename;
    }
    
    recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true } // runValidators to ensure schema constraints are met on update
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
router.post(
  '/:id/comment',
  [
    auth,
    check('text', 'Comment text cannot be empty').not().isEmpty().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const recommendation = await Recommendation.findById(req.params.id);

      if (!recommendation) {
        return res.status(404).json({ errors: [{ msg: 'Recommendation not found' }] });
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
