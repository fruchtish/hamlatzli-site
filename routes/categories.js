const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Required for checking isAdmin
const { check, validationResult } = require('express-validator');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Create a new category
// @access  Admin
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('hebrewName', 'Hebrew name is required').not().isEmpty().trim().escape(),
    check('iconUrl', 'Icon URL must be a valid URL').optional({ checkFalsy: true }).isURL().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ errors: [{ msg: 'Access denied. Admin only.' }] });
      }

      const { name, hebrewName, iconUrl } = req.body;

      let category = await Category.findOne({ $or: [{ name: name.toLowerCase() }, { hebrewName }] });
      if (category) {
          return res.status(400).json({ errors: [{ msg: 'Category with this name or hebrewName already exists' }] });
      }

      category = new Category({
      name,
      hebrewName,
      iconUrl
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') { // This might be redundant if validators catch all
        return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update an existing category
// @access  Admin
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name cannot be empty').optional().not().isEmpty().trim().escape(),
    check('hebrewName', 'Hebrew name cannot be empty').optional().not().isEmpty().trim().escape(),
    check('iconUrl', 'Icon URL must be a valid URL').optional({ checkFalsy: true }).isURL().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ errors: [{ msg: 'Access denied. Admin only.' }] });
      }

      const { name, hebrewName, iconUrl } = req.body;

      let category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
      }

      // Check if another category with the new name/hebrewName already exists
      if (name || hebrewName) {
        const query = { _id: { $ne: req.params.id } };
        const orConditions = [];
        if (name) orConditions.push({ name: name.toLowerCase() });
        if (hebrewName) orConditions.push({ hebrewName });
        if (orConditions.length > 0) query.$or = orConditions;

        const existingCategory = await Category.findOne(query);
        if (existingCategory) {
            return res.status(400).json({ errors: [{ msg: 'Another category with this name or hebrewName already exists' }] });
        }
      }

      if (req.body.hasOwnProperty('name')) category.name = name;
      if (req.body.hasOwnProperty('hebrewName')) category.hebrewName = hebrewName;
      if (req.body.hasOwnProperty('iconUrl')) category.iconUrl = iconUrl; // Allows clearing iconUrl if empty string is sent

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
    }
    if (err.name === 'ValidationError') { // Might be redundant
        return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ errors: [{ msg: 'Access denied. Admin only.' }] });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
    }

    // TODO: Consider what happens to recommendations using this category.
    // For now, we'll just delete the category.
    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
