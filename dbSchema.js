let db = {
  pengaduan: [
    pengaduanId,
    {
      userHandle: 'user',
      body: 'isi pesan',
      createdAt: '2020-07-01T00:04:53.863Z',
      likeCount: 5,
      commentCount: 2,
    },
  ],
  user: [
    {
      userId: 'id',
      email: 'email',
      handle: 'user',
      createdAt: 'date',
      foto: 'url_foto',
      jenisKelamin: 'laki-laki',
      tanggalLahir: 'date',
      website: 'www.user.com',
      socialMedia: {
        facebook: 'facebook',
        twitter: 'twitter',
        instagram: 'instagram',
      },
    },
  ],
};

let signUp = {
  signUp: [
    {
      namaLengkap: 'nama',
      email: 'email',
      noTelepon: 085155169220,
      password: '12345',
      confirmPassword: '12345',
    },
  ],
};

let userDetails = {
  credentials: db.user,
  likes: [user.userHandle, db.pengaduan[0]],
};
