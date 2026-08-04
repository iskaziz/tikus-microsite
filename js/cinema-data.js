(function registerTikusCinemaData(global) {
  'use strict';

  const states = [
    { id: 'johor', name: { en: 'Johor', ms: 'Johor' } },
    { id: 'kedah', name: { en: 'Kedah', ms: 'Kedah' } },
    { id: 'kuala-lumpur', name: { en: 'Kuala Lumpur', ms: 'Kuala Lumpur' } },
    { id: 'melaka', name: { en: 'Melaka', ms: 'Melaka' } },
    { id: 'pahang', name: { en: 'Pahang', ms: 'Pahang' } },
    { id: 'perak', name: { en: 'Perak', ms: 'Perak' } },
    { id: 'perlis', name: { en: 'Perlis', ms: 'Perlis' } },
    { id: 'penang', name: { en: 'Penang', ms: 'Pulau Pinang' } },
    { id: 'putrajaya', name: { en: 'Putrajaya', ms: 'Putrajaya' } },
    { id: 'sabah', name: { en: 'Sabah', ms: 'Sabah' } },
    { id: 'sarawak', name: { en: 'Sarawak', ms: 'Sarawak' } },
    { id: 'selangor', name: { en: 'Selangor', ms: 'Selangor' } },
    { id: 'terengganu', name: { en: 'Terengganu', ms: 'Terengganu' } }
  ];

  const cinemas = [
    {
      id: 'gsc-paradigm-jb', state: 'johor', chain: 'gsc', name: 'GSC Paradigm JB',
      address: 'Lot 7F-01 & 7F-02, Paradigm Mall Johor Bahru, Jalan Skudai',
      source: 'GSC'
    },
    {
      id: 'tgv-tebrau', state: 'johor', chain: 'tgv', name: 'TGV Tebrau',
      address: 'S01, 2nd Floor, AEON Tebrau City Shopping Centre, 1 Jalan Desa Tebrau, Taman Desa Tebrau, 81100 Johor Bahru, Johor',
      source: 'TGV'
    },
    {
      id: 'paragon-batu-pahat', state: 'johor', chain: 'independent', name: 'Paragon Cinema, Batu Pahat Mall',
      address: '2nd Floor, Batu Pahat Mall, Jalan Kluang, 83000 Batu Pahat, Johor',
      source: 'Paragon Cinemas'
    },
    {
      id: 'gsc-aman-central', state: 'kedah', chain: 'gsc', name: 'GSC Aman Central',
      address: 'Lot 4-22, Aman Central, No. 1, Lebuhraya Darulaman',
      source: 'GSC'
    },
    {
      id: 'paragon-alor-star', state: 'kedah', chain: 'independent', name: 'Paragon Cinema, Alor Star',
      address: 'Lot 1.21, 1.22, 1.23 & 1.23A, 1st Floor, Alor Star Mall, Kawasan Perusahaan Tandop Baru, 05400 Alor Setar, Kedah',
      source: 'Paragon Cinemas'
    },
    {
      id: 'gsc-mytown', state: 'kuala-lumpur', chain: 'gsc', name: 'GSC MyTown',
      address: 'L3-01, Level 3, No. 6, Jalan Cochrane, Seksyen 90',
      source: 'GSC'
    },
    {
      id: 'gsc-mid-valley', state: 'kuala-lumpur', chain: 'gsc', name: 'GSC Midvalley Megamall',
      address: 'Lot T-001, 3rd Floor, Mid Valley Megamall, Mid Valley City, Lingkaran Syed Putra',
      source: 'GSC'
    },
    {
      id: 'tgv-wangsa-walk', state: 'kuala-lumpur', chain: 'tgv', name: 'TGV Wangsa Walk',
      address: '2-01, Level 2, Wangsa Walk Mall, Wangsa Avenue, 9 Jalan Wangsa Perdana 1, Bandar Wangsa Maju, 53300 Kuala Lumpur',
      source: 'TGV'
    },
    {
      id: 'tgv-suria-klcc', state: 'kuala-lumpur', chain: 'tgv', name: 'TGV Suria KLCC',
      address: 'Level 3, Suria KLCC, Kuala Lumpur City Centre, 50088 Kuala Lumpur',
      source: 'TGV'
    },
    {
      id: 'gsc-dataran-pahlawan', state: 'melaka', chain: 'gsc', name: 'GSC Dataran Pahlawan',
      address: 'Lot F5-01, Dataran Pahlawan Melaka Megamall, Jalan Merdeka, Bandar Hilir',
      source: 'GSC'
    },
    {
      id: 'gsc-kuantan-city-mall', state: 'pahang', chain: 'gsc', name: 'GSC Kuantan City Mall',
      address: 'L4-AT-01, Level 4, Kuantan City Mall, Jalan Putra Square 6/1, Putra Square',
      source: 'GSC'
    },
    {
      id: 'gsc-ipoh-parade', state: 'perak', chain: 'gsc', name: 'GSC Ipoh Parade',
      address: 'Lot R01, 5th Floor, Ipoh Parade, No. 105, Jalan Sultan Abdul Jalil, Greentown',
      source: 'GSC'
    },
    {
      id: 'gsc-kangar', state: 'perlis', chain: 'gsc', name: 'GSC Kangar',
      address: 'Kangar Jaya Mall, Kangar Jaya, 01000 Kangar, Perlis',
      source: 'GSC'
    },
    {
      id: 'tgv-gurney', state: 'penang', chain: 'tgv', name: 'TGV Gurney',
      address: 'Level 8, Gurney Paragon Mall, Lorong Kelawai, 10250 George Town, Pulau Pinang',
      source: 'TGV'
    },
    {
      id: 'gsc-ioi-city-mall', state: 'putrajaya', chain: 'gsc', name: 'GSC IOI City Mall Putrajaya',
      address: 'L2-AT5, IOI City Mall, Lebuh IRC, IOI Resort City, 62502 Putrajaya',
      source: 'IOI City Mall / GSC'
    },
    {
      id: 'gsc-imago-kk', state: 'sabah', chain: 'gsc', name: 'GSC Imago Shopping Mall KK',
      address: 'Lot 2-52, Second Floor, IMAGO Shopping Mall, KK Times Square Phase 2, Off Coastal Highway',
      source: 'GSC'
    },
    {
      id: 'gsc-the-spring-kuching', state: 'sarawak', chain: 'gsc', name: 'GSC The Spring Kuching',
      address: 'Lot 214, Second Floor, The Spring Shopping Mall, Persiaran Spring',
      source: 'GSC'
    },
    {
      id: 'gsc-setia-city-mall', state: 'selangor', chain: 'gsc', name: 'GSC Setia City Mall',
      address: 'L2-MM03, Setia City Mall, No. 7, Persiaran Setia Dagang, Bandar Setia Alam, Seksyen U13',
      source: 'GSC'
    },
    {
      id: 'gsc-ioi-mall-puchong', state: 'selangor', chain: 'gsc', name: 'GSC IOI Mall Puchong',
      address: 'Lot ET-11, 3rd Floor, IOI Mall, Batu 9, Jalan Puchong',
      source: 'GSC'
    },
    {
      id: 'tgv-sunway-pyramid', state: 'selangor', chain: 'tgv', name: 'TGV Sunway Pyramid',
      address: 'F1.01, Level 1, Sunway Pyramid, 3 Jalan PJS 11/15, Bandar Sunway, 46150 Petaling Jaya, Selangor',
      source: 'TGV'
    },
    {
      id: 'tgv-1-utama', state: 'selangor', chain: 'tgv', name: 'TGV 1 Utama',
      address: 'Level 3, Old Wing, 1 Utama Shopping Centre, 1 Lebuh Bandar Utama, Bandar Utama, 47800 Petaling Jaya, Selangor',
      source: 'TGV'
    },
    {
      id: 'paragon-ktcc-mall', state: 'terengganu', chain: 'independent', name: 'Pawagam Paragon Cinemas KTCC Mall',
      address: 'Level 2, Lot 2-888, KTCC Mall, Sultan Zainal Abidin, Muara Selatan, Terengganu',
      source: 'Paragon Cinemas'
    }
  ];

  const chainCounts = cinemas.reduce((counts, cinema) => {
    counts[cinema.chain] = (counts[cinema.chain] || 0) + 1;
    return counts;
  }, {});

  const stateCounts = cinemas.reduce((counts, cinema) => {
    counts[cinema.state] = (counts[cinema.state] || 0) + 1;
    return counts;
  }, {});

  global.TikusCinemaData = Object.freeze({
    states: Object.freeze(states),
    cinemas: Object.freeze(cinemas),
    stateCounts: Object.freeze(stateCounts),
    chainCounts: Object.freeze(chainCounts),
    total: cinemas.length
  });
})(window);
