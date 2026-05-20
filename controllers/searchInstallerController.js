const db = require('../config/firebase');

const searchInstallers = async (req, res) => {

  try {

    const snapshot = await db
      .collection('installers')
      .get();

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