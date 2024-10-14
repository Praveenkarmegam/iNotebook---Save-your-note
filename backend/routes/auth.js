const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Dharunisagoodb$oy';

//ROUTE 1: Creae a User using: POST "/api/auth/createuser" . No login required
router.post('/createuser', [
  body('Name', "Enter a valid name").isLength({ min: 3 }),
  body('Email', "Enter a valid password").isEmail(),
  body('Password', "Password must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  //if there are errors,return Bad request and errors
  console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() })
  }

  try {

    //check whether user with this email exist
    let user = await User.findOne({ Email: req.body.Email });
    if (user) {
      return res.status(400).json({success, error: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.Password, salt);
    //create a new user
    user = await User.create({
      Name: req.body.Name,
      Password: secPass,
      Email: req.body.Email
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    //  res.json(user)
    let success = true;
    res.json({success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }

})

//ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('Email', 'Enter a valid email').isEmail(),
  body('Password', 'Password cannot be blank').exists(),
], async (req, res) => {

  let success = false;

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Email, Password } = req.body;
  try {
    let user = await User.findOne({ Email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const PasswordCompare = await bcrypt.compare(Password, user.Password);
    if (!PasswordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })
    console.log(authtoken)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-Password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router