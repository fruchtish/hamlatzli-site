const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For deleting old avatars

// Multer config for avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/uploads/avatars/';
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});

const avatarFileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files (jpeg, png, gif) are allowed!';
    return cb(new Error('Only image files (jpeg, png, gif) are allowed!'), false);
  }
  cb(null, true);
};

const uploadAvatar = multer({ storage: avatarStorage, fileFilter: avatarFileFilter });

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty().trim().escape(),
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user); // profileImageUrl and bio will be included if they exist
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile (username, bio, avatar)
// @access  Private
router.put(
  '/profile',
  [
    auth,
    uploadAvatar.single('avatar'),
    check('username', 'Username must be at least 3 characters long')
      .optional()
      .isLength({ min: 3 })
      .trim()
      .escape(),
    check('bio', 'Bio must be at most 500 characters long').optional().isLength({ max: 500 }).trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.fileValidationError) {
      return res.status(400).json({ errors: [{ msg: req.fileValidationError }] });
    }

    const { username, bio } = req.body;
    const userId = req.user.id;

    try {
      let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update username if provided and different
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ errors: [{ msg: 'Username already taken' }] });
      }
      user.username = username;
    }

    // Update bio if provided (use req.body.bio to check if it was actually sent)
    if (req.body.hasOwnProperty('bio')) {
      user.bio = bio;
    }

    // Update profile image if a new one is uploaded
    if (req.file) {
      // Delete old avatar if it exists and is different
      if (user.profileImageUrl && user.profileImageUrl !== `/uploads/avatars/${req.file.filename}`) {
        const oldAvatarPath = path.join(__dirname, '..', 'public', user.profileImageUrl);
        if (fs.existsSync(oldAvatarPath)) {
          try {
            fs.unlinkSync(oldAvatarPath);
          } catch (unlinkErr) {
            console.error("Error deleting old avatar:", unlinkErr);
            // Not a fatal error, so we can continue
          }
        }
      }
      user.profileImageUrl = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    // Return updated user, excluding password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
