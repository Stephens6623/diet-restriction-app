const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiService = require('../services/aiService');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Analyze barcode or label
router.post('/product', upload.single('image'), async (req, res) => {
  try {
    const { barcode, restrictions } = req.body;
    const image = req.file;

    if (!restrictions) {
      return res.status(400).json({ error: 'Dietary restrictions are required' });
    }

    let restrictionsArray;
    try {
      restrictionsArray = JSON.parse(restrictions);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid restrictions format' });
    }

    let result;

    if (barcode) {
      // Analyze by barcode
      result = await aiService.analyzeByBarcode(barcode, restrictionsArray);
    } else if (image) {
      // Analyze by image
      result = await aiService.analyzeByImage(image.buffer, restrictionsArray);
    } else {
      return res.status(400).json({ error: 'Either barcode or image is required' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error analyzing product:', error);
    res.status(500).json({ 
      error: 'Failed to analyze product', 
      message: error.message 
    });
  }
});

module.exports = router;
