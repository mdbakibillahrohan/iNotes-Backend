const express = require("express");
const fetchUsers = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Route - 1: Fetch all the notes using GET '/api/notes/fetchallnotes' authentication required
router.get('/fetchallnotes', fetchUsers, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})

// Route - 2: insert notes using POST '/api/notes/addnote' authentication required
router.post('/addnote', fetchUsers, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})

module.exports = router;