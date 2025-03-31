const express = require('express');
const router = express.Router();
const Farminfo = require('../models/Farminfo');

// Get all farminfo entries
router.get('/', async (req, res) => {
  try {
    const farminfo = await Farminfo.find();
    res.header('Content-Type', 'application/json');
    res.json(farminfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/farminfo/seed - Seed initial data if collection is empty
// IMPORTANT: This specific route must be defined BEFORE the /:id route
router.get('/seed', async (req, res) => {
  try {
    // Check if collection is empty
    const count = await Farminfo.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Database already has data', count });
    }

    // Sample data to seed
    const sampleData = [
      {
        name: "Green Acres Farm",
        address: "123 Rural Route",
        city: "Springfield",
        state: "IL",
        zip: "62701",
        coordinates: {
          lat: 39.781721,
          lng: -89.650148
        },
        category: "Farm",
        isPublic: true,
        description: "Family-owned organic farm offering seasonal produce and farm tours."
      },
      {
        name: "City Farmers Market",
        address: "456 Main Street",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        coordinates: {
          lat: 41.878113,
          lng: -87.629799
        },
        category: "Market",
        isPublic: true,
        description: "Weekly farmers market featuring local producers and artisanal goods."
      },
      {
        name: "Community Garden Collective",
        address: "789 Park Avenue",
        city: "Evanston",
        state: "IL",
        zip: "60201",
        coordinates: {
          lat: 42.045072,
          lng: -87.687697
        },
        category: "Garden",
        isPublic: true,
        description: "Community-run garden space with educational programs and volunteering opportunities."
      }
    ];

    // Insert the sample data
    const result = await Farminfo.insertMany(sampleData);
    res.status(201).json({ 
      message: 'Database seeded successfully', 
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single farminfo entry
router.get('/:id', async (req, res) => {
  try {
    const farminfo = await Farminfo.findById(req.params.id);
    if (farminfo) {
      res.json(farminfo);
    } else {
      res.status(404).json({ message: 'Farminfo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new farminfo entry
router.post('/', async (req, res) => {
  const farminfo = new Farminfo(req.body);
  try {
    const newFarminfo = await farminfo.save();
    res.status(201).json(newFarminfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update farminfo entry
router.put('/:id', async (req, res) => {
  try {
    const farminfo = await Farminfo.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    if (!farminfo) {
      return res.status(404).json({ message: 'Farminfo not found' });
    }
    res.json(farminfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete farminfo entry
router.delete('/:id', async (req, res) => {
  try {
    const farminfo = await Farminfo.findByIdAndDelete(req.params.id);
    if (!farminfo) {
      return res.status(404).json({ message: 'Farminfo not found' });
    }
    res.json({ message: 'Farminfo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 