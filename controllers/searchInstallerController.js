const db = require('../config/firebase');

const searchInstallers = async (req, res) => {

  try {

    const { query } = req.query;

    // BLOCK EMPTY SEARCH
    if(!query || query.trim() === '') {

      return res.status(400).json({
        error: 'Please enter city or postcode'
      });

    }

    const snapshot = await db
      .collection('installers')
      .where('status', '==', 'approved')
      .get();

    let installers = [];

    snapshot.forEach(doc => {

      const data = doc.data();

      const city =
        (data.city || '').toLowerCase();

      const postcode =
        (data.postcode || '').toLowerCase();

      const search =
        query.toLowerCase().trim();

      // Partial matching
      if(
        city.includes(search) ||
        postcode.includes(search)
      ) {

        installers.push({
          id: doc.id,
          ...data
        });

      }

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