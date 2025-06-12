const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Simple slugify function to create URL-friendly slugs from letterTitle
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

// POST /data - create new data entry with slug
router.post('/', async (req, res) => {
  try {
    const { email, letterTitle, letterBody, letterSender, sharePublicly } = req.body;
    const slug = slugify(letterTitle);

    // Check if slug already exists to ensure uniqueness
    const existing = await Data.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Letter title must be unique' });
    }

    const newData = new Data({ email, letterTitle, letterBody, letterSender, sharePublicly, slug });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET /data - get all data entries
router.get('/', async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await Data.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// GET /data/:slug - get data entry by slug
router.get('/:slug', async (req, res) => {
  try {
    const data = await Data.findOne({ slug: req.params.slug });
    if (!data) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
