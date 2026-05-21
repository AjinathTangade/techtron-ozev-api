const db = require('../config/firebase');

const getInstallers = async (req, res) => {

  try {

    const snapshot = await db
      .collection('installers')
      .get();

    let installers = [];

    snapshot.forEach(doc => {

      installers.push({
        ...doc.data(),
        firestoreId: doc.id   // always expose the real Firestore doc ID separately
      });

    });

    res.status(200).json(installers);

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const approveInstaller = async (req, res) => {

  try {

    const { id } = req.params;   // this is the Firestore doc ID

    const installerRef = db.collection('installers').doc(id);
    const doc = await installerRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Installer not found' });
    }

    await installerRef.update({
      status: 'approved',
      approvedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Installer approved successfully'
    });

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const deleteInstaller = async (req, res) => {

  try {

    const { id } = req.params;   // this is the Firestore doc ID

    const installerRef = db.collection('installers').doc(id);
    const doc = await installerRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Installer not found' });
    }

    await installerRef.delete();

    res.status(200).json({
      success: true,
      message: 'Installer deleted successfully'
    });

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getInstallers,
  approveInstaller,
  deleteInstaller
};
