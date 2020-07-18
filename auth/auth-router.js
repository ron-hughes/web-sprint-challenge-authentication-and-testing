const bcrypt = require("bcryptjs")
const router= require("express").Router();
const users = require("../users/users-model");
const {generateToken} = require('../utils/utils');



//register a new user
router.post('/register', (req, res) => {
const userInfo = req.body;

const hash = bcrypt.hashSync(userInfo.password, 8);

userInfo.password = hash;


users.add(userInfo)
.then(user => {
  res.status(201).json(user);
})
.catch(error => {
  console.log('error', error)
  res.status(500).json({ error: "Could not process your request" });
})
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;
    users.findBy({ username })
      .first()
      .then(user => {
        // if we have a user and the password matches the hash
        if (user && bcrypt.compareSync(password, user.password)) {
          //generate a token
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!`, token
          });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }//end if
      })
      .catch(error => {
        console.log('error:', error)
        res.status(500).json({ error: "Could not process your request" })
      })
  
  })//end login
  
  

module.exports = router;