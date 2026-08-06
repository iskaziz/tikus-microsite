(function registerTikusCinemaData(global) {
  'use strict';

  const areas = [
    { id: 'johor', en: 'Johor', ms: 'Johor' },
    { id: 'kedah', en: 'Kedah', ms: 'Kedah' },
    { id: 'kuala-lumpur', en: 'Kuala Lumpur', ms: 'Kuala Lumpur' },
    { id: 'melaka', en: 'Melaka', ms: 'Melaka' },
    { id: 'pahang', en: 'Pahang', ms: 'Pahang' },
    { id: 'perak', en: 'Perak', ms: 'Perak' },
    { id: 'perlis', en: 'Perlis', ms: 'Perlis' },
    { id: 'penang', en: 'Penang', ms: 'Pulau Pinang' },
    { id: 'putrajaya', en: 'Putrajaya', ms: 'Putrajaya' },
    { id: 'sabah', en: 'Sabah', ms: 'Sabah' },
    { id: 'sarawak', en: 'Sarawak', ms: 'Sarawak' },
    { id: 'selangor', en: 'Selangor', ms: 'Selangor' },
    { id: 'terengganu', en: 'Terengganu', ms: 'Terengganu' }
  ];

  const venues = [
    { area: 'johor', chain: 'GSC', name: 'GSC Paradigm JB', address: 'Lot 7F-01 & 7F-02, Paradigm Mall Johor Bahru, Jalan Skudai' },
    { area: 'johor', chain: 'TGV', name: 'TGV Tebrau', address: 'S01, 2nd Floor, AEON Tebrau City Shopping Centre, 1 Jalan Desa Tebrau, Taman Desa Tebrau, 81100 Johor Bahru, Johor' },
    { area: 'johor', chain: 'PARAGON', name: 'Paragon Cinema, Batu Pahat Mall', address: '2nd Floor, Batu Pahat Mall, Jalan Kluang, 83000 Batu Pahat, Johor' },
    { area: 'kedah', chain: 'GSC', name: 'GSC Aman Central', address: 'Lot 4-22, Aman Central, No. 1, Lebuhraya Darulaman' },
    { area: 'kedah', chain: 'PARAGON', name: 'Paragon Cinema, Alor Star', address: 'Lot 1.21, 1.22, 1.23 & 1.23A, 1st Floor, Alor Star Mall, Kawasan Perusahaan Tandop Baru, 05400 Alor Setar, Kedah' },
    { area: 'kuala-lumpur', chain: 'GSC', name: 'GSC MyTown', address: 'L3-01, Level 3, No. 6, Jalan Cochrane, Seksyen 90' },
    { area: 'kuala-lumpur', chain: 'GSC', name: 'GSC Midvalley Megamall', address: 'Lot T-001, 3rd Floor, Mid Valley Megamall, Mid Valley City, Lingkaran Syed Putra' },
    { area: 'kuala-lumpur', chain: 'TGV', name: 'TGV Wangsa Walk', address: '2-01, Level 2, Wangsa Walk Mall, Wangsa Avenue, 9 Jalan Wangsa Perdana 1, Bandar Wangsa Maju, 53300 Kuala Lumpur' },
    { area: 'kuala-lumpur', chain: 'TGV', name: 'TGV Suria KLCC', address: 'Level 3, Suria KLCC, Kuala Lumpur City Centre, 50088 Kuala Lumpur' },
    { area: 'melaka', chain: 'GSC', name: 'GSC Dataran Pahlawan', address: 'Lot F5-01, Dataran Pahlawan Melaka Megamall, Jalan Merdeka, Bandar Hilir' },
    { area: 'pahang', chain: 'GSC', name: 'GSC Kuantan City Mall', address: 'L4-AT-01, Level 4, Kuantan City Mall, Jalan Putra Square 6/1, Putra Square' },
    { area: 'perak', chain: 'GSC', name: 'GSC Ipoh Parade', address: 'Lot R01, 5th Floor, Ipoh Parade, No. 105, Jalan Sultan Abdul Jalil, Greentown' },
    { area: 'perlis', chain: 'GSC', name: 'GSC Kangar', address: 'Kangar Jaya Mall, Kangar Jaya, 01000 Kangar, Perlis' },
    { area: 'penang', chain: 'TGV', name: 'TGV Gurney', address: 'Level 8, Gurney Paragon Mall, Lorong Kelawai, 10250 George Town, Pulau Pinang' },
    { area: 'putrajaya', chain: 'GSC', name: 'GSC IOI City Mall Putrajaya', address: 'L2-AT5, IOI City Mall, Lebuh IRC, IOI Resort City, 62502 Putrajaya' },
    { area: 'sabah', chain: 'GSC', name: 'GSC Imago Shopping Mall KK', address: 'Lot 2-52, Second Floor, IMAGO Shopping Mall, KK Times Square Phase 2, Off Coastal Highway' },
    { area: 'sarawak', chain: 'GSC', name: 'GSC The Spring Kuching', address: 'Lot 214, Second Floor, The Spring Shopping Mall, Persiaran Spring' },
    { area: 'selangor', chain: 'GSC', name: 'GSC Setia City Mall', address: 'L2-MM03, Setia City Mall, No. 7, Persiaran Setia Dagang, Bandar Setia Alam, Seksyen U13' },
    { area: 'selangor', chain: 'GSC', name: 'GSC IOI Mall Puchong', address: 'Lot ET-11, 3rd Floor, IOI Mall, Batu 9, Jalan Puchong' },
    { area: 'selangor', chain: 'TGV', name: 'TGV Sunway Pyramid', address: 'F1.01, Level 1, Sunway Pyramid, 3 Jalan PJS 11/15, Bandar Sunway, 46150 Petaling Jaya, Selangor' },
    { area: 'selangor', chain: 'TGV', name: 'TGV 1 Utama', address: 'Level 3, Old Wing, 1 Utama Shopping Centre, 1 Lebuh Bandar Utama, Bandar Utama, 47800 Petaling Jaya, Selangor' },
    { area: 'terengganu', chain: 'PARAGON', name: 'Pawagam Paragon Cinemas KTCC Mall', address: 'Level 2, Lot 2-888, KTCC Mall, Sultan Zainal Abidin, Muara Selatan, Terengganu' }
  ];

  const frozenAreas = areas.map((item) => Object.freeze(item));
  const frozenVenues = venues.map((item) => Object.freeze(item));

  global.TikusCinemaData = Object.freeze({
    areas: Object.freeze(frozenAreas),
    venues: Object.freeze(frozenVenues),
    total: frozenVenues.length,
    chainTotals: Object.freeze({ GSC: 13, TGV: 6, PARAGON: 3 })
  });
})(window);
