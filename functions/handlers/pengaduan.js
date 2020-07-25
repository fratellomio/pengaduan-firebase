const { db } = require('../util/admin');

exports.getAllPengaduan = (req, res) => {
  db.collection('pengaduan')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let pengaduan = [];
      data.forEach((doc) => {
        pengaduan.push({
          pengaduanId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(pengaduan);
    })

    .catch((err) => console.error(err));
};

exports.postOnePengaduan = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }
  const newPengaduan = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection('pengaduan')
    .add(newPengaduan)
    .then((doc) => {
      const resPengaduan = newPengaduan;
      resPengaduan.pengaduanId = doc.id;
      res.json(resPengaduan);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

exports.getPengaduan = (req, res) => {
  let pengaduanData = {};
  db.doc(`/pengaduan/${req.params.pengaduanId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
      }
      pengaduanData = doc.data();
      pengaduanData.pengaduanId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('pengaduanId', '==', req.params.pengaduanId)
        .get();
    })
    .then((data) => {
      pengaduanData.comments = [];
      data.forEach((doc) => {
        pengaduanData.comments.push(doc.data());
      });
      return res.json(pengaduanData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentPengaduan = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    pengaduanId: req.params.pengaduanId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/pengaduan/${req.params.pengaduanId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'pengaduan tidak ditemukan' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
};

exports.likePengaduan = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('pengaduanId', '==', req.params.pengaduanId)
    .limit(1);
  const pengaduanDocument = db.doc(`/pengaduan/${req.params.pengaduanId}`);

  let pengaduanData;

  pengaduanDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        pengaduanData = doc.data();
        pengaduanData.pengaduanId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'pengaduan tidak ditemukan' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            pengaduanId: req.params.pengaduanId,
            userHandle: req.user.handle,
          })
          .then(() => {
            pengaduanData.likeCount++;
            return pengaduanDocument.update({
              likeCount: pengaduanData.likeCount,
            });
          })
          .then(() => {
            return res.json(pengaduanData);
          });
      } else {
        return res.status(400).json({ error: 'pengaduan sudah dilike' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikePengaduan = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('pengaduanId', '==', req.params.pengaduanId)
    .limit(1);
  const pengaduanDocument = db.doc(`/pengaduan/${req.params.pengaduanId}`);
  let pengaduanData;

  pengaduanDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        pengaduanData = doc.data();
        pengaduanData.pengaduanId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'pengaduan tidak ditemukan' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'pengaduan belum  dilike' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            pengaduanData.likeCount--;
            return pengaduanDocument.update({
              likeCount: pengaduanData.likeCount,
            });
          })
          .then(() => {
            res.json(pengaduanData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deletePengaduan = (req, res) => {
  const document = db.doc(`/pengaduan/${req.params.pengaduanId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'pengaduan tidak ditemukan' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        res.status(403).json({ error: 'unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'pengaduan berhasil dihapus' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
