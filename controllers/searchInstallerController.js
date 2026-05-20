const db = require('../config/firebase');

const searchInstallers = async (req, res) => {

  try {

    const { city, postcode } = req.query;

    let query = db.collection('installers');

    if(city) {

      query = query.where('city', '==', city);

    }

    if(postcode) {

      query = query.where('postcode', '==', postcode);

    }

    const snapshot = await query.get();

    let installers = [];

    snapshot.forEach(doc => {

      installers.push({
        id: doc.id,
        ...doc.data()
      });

    });

    res.status(200).json(installers);

  } catch(error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = searchInstallers;