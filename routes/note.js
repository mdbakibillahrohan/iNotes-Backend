const express = require("express");
const fetchUsers = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Route - 1: Fetch all the notes using GET '/api/notes/fetchallnotes' authentication required
router.get('/fetchallnotes', fetchUsers, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
});

// Route - 2: insert notes using POST '/api/notes/addnote' authentication required
router.post('/addnote', fetchUsers, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description value atleast 5").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json(errors.array());
        }
        ({ title, description, tag } = req.body);
        const notes = new Notes({
            user: req.user.id,
            title: title,
            description: description,
            tag: tag
        });
        const savedNotes = await notes.save();
        res.json(savedNotes);
    } catch (error) {
        console.log(error.message);
        res.json({ error: "Something went wrong" });

    }
});


// Route - 3: Update an existing note using PUT '/api/notes/updatenote' authentication required
router.put("/updatenote/:id", fetchUsers, [], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        ({ title, description, tag } = req.body);
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note })
    } catch (error) {
        console.log(error.message);
        res.json({ error: "Someting went wrong" });
    }
})

// Route - 4: deletenote an existing note using DELETE '/api/notes/deletenote' authentication required
router.delete("/deletenote/:id", fetchUsers, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        // Check that is the user valid or invalid 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note.delete();
        return res.send("Successfully Deleted");

    } catch (error) {
        console.log(error.message);
        res.json({ error: "Someting went wrong" });
    }
})
module.exports = router;