const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    if(
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {

      return res.status(401).json({
        error: 'Invalid credentials'
      });

    }

    const token = jwt.sign(
      {
        email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '1d'
      }
    );

    res.status(200).json({
      success: true,
      token
    });

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  adminLogin
};