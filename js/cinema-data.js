(function registerTikusCinemaData(global) {
  'use strict';

  // Confirmed FINAS Skim Wajib Tayang locations from Borang C dated 27 August 2026.
  const areas = [
    { id: 'johor', en: 'Johor', ms: 'Johor' },
    { id: 'kedah', en: 'Kedah', ms: 'Kedah' },
    { id: 'kuala-lumpur', en: 'Kuala Lumpur', ms: 'Kuala Lumpur' },
    { id: 'melaka', en: 'Melaka', ms: 'Melaka' },
    { id: 'pahang', en: 'Pahang', ms: 'Pahang' },
    { id: 'penang', en: 'Penang', ms: 'Pulau Pinang' },
    { id: 'putrajaya', en: 'Putrajaya', ms: 'Putrajaya' },
    { id: 'sabah', en: 'Sabah', ms: 'Sabah' },
    { id: 'sarawak', en: 'Sarawak', ms: 'Sarawak' },
    { id: 'selangor', en: 'Selangor', ms: 'Selangor' },
    { id: 'terengganu', en: 'Terengganu', ms: 'Terengganu' }
  ];

  const venues = [
    { area: 'johor', chain: 'GSC', name: 'GSC Paradigm JB', address: 'Lot 7F-01 & 7F-02, Paradigm Mall Johor Bahru, Jalan Skudai, Johor Bahru, Johor' },
    { area: 'kedah', chain: 'GSC', name: 'GSC Aman Central', address: 'Lot 4-22, Aman Central, No. 1, Lebuhraya Darulaman, Alor Setar, Kedah' },
    { area: 'kuala-lumpur', chain: 'GSC', name: 'GSC Midvalley Megamall', address: 'Lot T-001, 3rd Floor, Mid Valley Megamall, Mid Valley City, Lingkaran Syed Putra, Kuala Lumpur' },
    { area: 'melaka', chain: 'GSC', name: 'GSC Dataran Pahlawan', address: 'Lot F5-01, Dataran Pahlawan Melaka Megamall, Jalan Merdeka, Bandar Hilir, Melaka' },
    { area: 'pahang', chain: 'GSC', name: 'GSC Kuantan City Mall', address: 'L4-AT-01, Level 4, Kuantan City Mall, Jalan Putra Square 6/1, Putra Square, Kuantan, Pahang' },
    { area: 'putrajaya', chain: 'GSC', name: 'GSC IOI City Mall', address: 'L2-AT5, IOI City Mall, Lebuh IRC, IOI Resort City, 62502 Putrajaya' },
    { area: 'sabah', chain: 'GSC', name: 'GSC Imago Shopping Mall', address: 'Lot 2-52, Second Floor, Imago Shopping Mall, KK Times Square Phase 2, Off Coastal Highway, Kota Kinabalu, Sabah' },
    { area: 'sarawak', chain: 'GSC', name: 'GSC The Spring, Kuching', address: 'Lot 214, Second Floor, The Spring Shopping Mall, Persiaran Spring, Kuching, Sarawak' },
    { area: 'johor', chain: 'TGV', name: 'TGV Tebrau', address: 'S01, 2nd Floor, AEON Tebrau City Shopping Centre, 1 Jalan Desa Tebrau, Taman Desa Tebrau, 81100 Johor Bahru, Johor' },
    { area: 'kuala-lumpur', chain: 'TGV', name: 'TGV Wangsa Walk', address: '2-01, Level 2, Wangsa Walk Mall, Wangsa Avenue, 9 Jalan Wangsa Perdana 1, Bandar Wangsa Maju, 53300 Kuala Lumpur' },
    { area: 'penang', chain: 'TGV', name: 'TGV Gurney', address: 'Level 8, Gurney Paragon Mall, Lorong Kelawai, 10250 George Town, Pulau Pinang' },
    { area: 'selangor', chain: 'TGV', name: 'TGV Bukit Tinggi', address: 'Lot S32, 2nd Floor, AEON Bukit Tinggi Shopping Centre, 1 Persiaran Batu Nilam 1/KS6, Bandar Bukit Tinggi 2, 41200 Klang, Selangor' },
    { area: 'johor', chain: 'PARAGON', name: 'Paragon Cinemas Batu Pahat', address: '2nd Floor, Batu Pahat Mall, Jalan Kluang, 83000 Batu Pahat, Johor' },
    { area: 'terengganu', chain: 'PARAGON', name: 'Paragon Cinema KTCC', address: 'Lot 2-888, Level 2, KTCC Mall, Jalan Sultan Zainal Abidin, Muara Selatan, 20000 Kuala Terengganu, Terengganu' },
    { area: 'kedah', chain: 'MEGA', name: 'Mega Cineplex Riverfront Mall', address: 'Riverfront City, 192 & 193, Jalan Mawar 3/2, Taman Pekan Baru, 08000 Sungai Petani, Kedah' }
  ];

  const frozenAreas = areas.map((item) => Object.freeze(item));
  const frozenVenues = venues.map((item) => Object.freeze(item));

  global.TikusCinemaData = Object.freeze({
    areas: Object.freeze(frozenAreas),
    venues: Object.freeze(frozenVenues),
    total: frozenVenues.length,
    chainTotals: Object.freeze({ GSC: 8, TGV: 4, PARAGON: 2, MEGA: 1 })
  });
})(window);
