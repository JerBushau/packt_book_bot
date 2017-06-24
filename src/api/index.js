'use strict'

const express = require('express');
const Team = require('../models/team');
const router = express.Router();

// GET all teams
router.get('/teams', function(req, res) {
  Team.find({}, function(err, teams) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ teams: teams });
  });
});

// DELETE team by teamID(which should be unique)
router.delete('/team/:teamID', function(req, res) {
  const teamId = req.params.teamID;
  Team.findOneAndRemove(teamId, function(err, result) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'team deleted' });
  });
});

// DELETE by _id
router.delete('/teams/:id', function(req, res) {
  const id = req.params.id;
  Team.findByIdAndRemove(id, function(err, result) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'team deleted' });
  });
});

// PUT
router.put('/team/:id', function( req, res) {
  const id = req.params.id;
  const team = req.body;

  Team.findByIdAndUpdate(id, team, { new: true }, function(err, team) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({team: team, message: 'team updated'});

  });
});

// POST new team
router.post('/teams', function(req, res) {
  const team = req.body;
  Team.create(team, function(err, team) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ team: team, message: 'team created' });
  });
});

module.exports = router;
