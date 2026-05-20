const db = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const registerInstaller = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      city,
      postcode,
      qualifications
    } = req.body;

    const installerData = {
      id: uuidv4(),
      fullName,
      companyName,
      contactEmail: email,
      contactPhone: phone,
      city,
      postcode,
      qualifications,

      certificateUrls: {
        edition18: req.files.edition18[0].path,
        ozev: req.files.ozev[0].path,
        insurance: req.files.insurance[0].path
      },

      status: 'pending',
      createdAt: new Date()
    };

    await db.collection('installers').add(installerData);

    res.status(201).json({
      success: true,
      message: 'Registration submitted'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = registerInstaller;