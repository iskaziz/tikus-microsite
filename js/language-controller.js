(function registerTikusLanguageController(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-language-v1';
  const SUPPORTED = new Set(['en', 'ms']);

  const translations = Object.freeze({
    en: Object.freeze({
      'meta.title': 'TIKUS — Official Film Microsite',
      'meta.description': 'Enter Samasihat Wellness Retreat in the official interactive microsite for TIKUS, a Feisk Productions film.',
      'language.switchToMs': 'Language: English. Switch to Bahasa Malaysia.',
      'language.switchToEn': 'Bahasa: Bahasa Malaysia. Tukar ke English.',
      'site.skipExplorer': 'Skip to the house explorer',
      'hero.welcome': 'Welcome to Samasihat Wellness Retreat',
      'hero.headline': 'The weekend has only just begun.',
      'hero.support': 'A houseful of strangers. A murderer among them.',
      'site.feiskFilm': 'A Feisk Productions film',
      'hero.watchTrailer': 'Watch the trailer',
      'hero.scrollTrailer': 'Scroll to watch the trailer',
      'trailer.nowShowing': 'Now showing',
      'trailer.heading': 'Watch the trailer',
      'trailer.description': 'Tune in to TIKUS through a television from another time. Playback begins only after you choose to watch.',
      'trailer.playerLabel': 'Retro television trailer player',
      'trailer.playOfficial': 'Play official trailer',
      'trailer.playOfficialAria': 'Play the official TIKUS trailer',
      'trailer.note': 'The video is hosted by YouTube. No video is loaded until the television is selected.',
      'trailer.meetCast': 'Meet the cast',
      'trailer.official': 'Official trailer',
      'trailer.dialogDescription': 'YouTube video player for the official TIKUS trailer.',
      'trailer.close': 'Close trailer',
      'trailer.frameTitle': 'Official TIKUS trailer',
      'trailer.watchYoutube': 'Watch directly on YouTube',
      'trailer.firstLook': 'See the first look',
      'gallery.eyebrow': 'From the film',
      'gallery.heading': 'FIRST LOOK',
      'gallery.description': 'A selection of stills from TIKUS. Choose a frame to view it larger.',
      'gallery.enlarge': 'Enlarge',
      'gallery.previous': 'Previous film still',
      'gallery.next': 'Next film still',
      'gallery.filmstrip': 'TIKUS film still thumbnails',
      'gallery.instruction': 'Choose a thumbnail, use the arrow keys, or swipe across the featured image. Select the large image for fullscreen view.',
      'gallery.meetCast': 'Meet the cast',
      'gallery.filmOverview': 'Film overview',
      'overview.eyebrow': 'Film information',
      'overview.heading': 'TIKUS',
      'overview.synopsis': 'A group of guests attending a “healing” programme at a retreat become stranded when heavy rain cuts off every route out. The situation grows increasingly dire when it is revealed that there is a murderer among them.',
      'overview.posterAlt': 'Official TIKUS film poster in a distressed red, black and warm paper collage style.',
      'overview.director': 'Director',
      'overview.screenplay': 'Screenplay',
      'overview.producers': 'Producers',
      'overview.executiveProducers': 'Executive Producers',
      'overview.productionCompany': 'Production Company',
      'overview.cast': 'Cast',
      'overview.social': 'Social Media',
      'overview.imdb': 'View on IMDb',
      'overview.imdbAria': 'Open the TIKUS page on IMDb in a new tab',
      'overview.instagramAria': 'Open Feisk Productions on Instagram in a new tab',
      'overview.threadsAria': 'Open Feisk Productions on Threads in a new tab',
      'overview.hashtags': 'Campaign hashtags',
      'overview.meetCast': 'Meet the cast',
      'gallery.dialogEyebrow': 'TIKUS film stills',
      'gallery.dialogDescription': 'Fullscreen gallery of TIKUS film stills. Use the previous and next buttons or the left and right arrow keys to browse.',
      'gallery.dialogHint': 'Swipe or use ← → to browse. Press Escape to close.',
      'gallery.close': 'Close first look gallery',
      'gallery.openAria': 'Open still {index} of {total} larger',
      'gallery.thumbAria': 'Show still {index} of {total}',
      'gallery.status': 'Showing still {index} of {total}.',
      'gallery.alt.1': 'A TIKUS first-look still showing the retreat exterior surrounded by dense greenery.',
      'gallery.alt.2': 'A TIKUS first-look still showing a tense group gathered inside the retreat.',
      'gallery.alt.3': 'A TIKUS first-look still showing two women seated together inside Samasihat.',
      'gallery.alt.4': 'A TIKUS first-look still showing several people reacting tensely inside the retreat.',
      'gallery.alt.5': 'A TIKUS first-look still showing two figures facing each other in warm backlight.',
      'gallery.alt.6': 'A TIKUS first-look still showing a telephone beside a lit table lamp.',
      'gallery.alt.7': 'A TIKUS first-look still showing three people reacting with alarm in an interior doorway.',
      'cinema.eyebrow': 'Where to watch',
      'cinema.heading': '22 cinemas nationwide',
      'cinema.intro': 'Choose a state to see participating cinemas, addresses and directions.',
      'cinema.cinemas': 'Cinemas',
      'cinema.independent': 'Independent',
      'cinema.statsLabel': 'TIKUS cinema release network: 22 cinemas, 13 GSC, 6 TGV and 3 independent cinemas',
      'cinema.selectorLabel': 'Select your state',
      'cinema.selectorHelp': 'Choose a state or territory to see its participating cinemas.',
      'cinema.chooseState': 'Choose a state',
      'cinema.empty': 'Select a state to see cinema locations.',
      'cinema.locationCount': '{count} locations',
      'cinema.openMap': 'Open in Maps',
      'cinema.openMapAria': 'Open {cinema} in Google Maps',
      'cinema.status': '{count} cinema locations shown for {state}.',
      'cinema.disclaimer': 'Cinema locations are based on the TIKUS release list. Schedules can change, so confirm before travelling.',
      'cast.eyebrow': 'Cast',
      'cast.heading': 'Meet the cast',
      'cast.intro': 'Select a portrait to read more about the cast member.',
      'cast.tableLabel': 'Cast portrait cards',
      'cast.instruction': 'Select a card to read the cast profile. Select it again to return to the portrait.',
      'cast.enterHouse': 'Enter the house',
      'cast.portraitPlaceholder': '{name} portrait placeholder',
      'cast.portraitComing': 'Portrait coming soon',
      'cast.profileComing': 'Profile coming soon.',
      'cast.bioLabel': 'Cast profile',
      'cast.revealBio': 'Read profile',
      'cast.returnPortrait': 'Return to portrait',
      'cast.frontAria': '{actor}. Flip to read the cast profile.',
      'cast.backAria': '{actor} profile. Flip to return to the portrait.',
      'cast.frontStatus': 'Showing the portrait for {actor}.',
      'cast.backStatus': 'Showing the cast profile for {actor}.',
      'cast.bio.yMun': "I’m Nicholas Chin, and TIKUS is my very first feature film. I’ve always loved films and did a bit of theatre in college. Getting cast in this role was such an unexpected and exciting moment for me, and honestly the whole process from auditions to filming has taught me so much. I’m really grateful to be part of this project and can’t wait for people to finally see it!",
      'cast.bio.haiccal': 'Haiccal Hazim is a Malaysian actor, stage actor, model, commercial talent and a host, who is passionate about bringing honest and relatable characters to life. With experience in theatre, film, and commercial productions, he enjoys collaborating with creative teams and embracing new challenges both on and off screen. His commitment to continuous growth and storytelling has allowed him to work across a variety of projects, and he looks forward to connecting with audiences through every role he takes on.',
      'cast.bio.diana': 'At 73, Diana Ooi proves it is never too late to chase a lifelong calling. After stepping down from her second career in 2020, she immediately pivoted to her childhood passion for acting. Just a year later, she landed her standout screen debut playing a character with dementia in an entry for Short + Sweet Malaysia, establishing herself as a compelling, authentic talent',
      'cast.bio.iski': "Iski Senna is a Thespian, Tango Dancer and Drama teacher. From Istana Budaya to ITV UK, Netflix to Nueve de Julio Avenue, his particular set of skills has taken him to many places, mostly unexpected.\n\nYou might have seen him in bit parts on Netflix's \"Marco Polo\" and ITV's \"The Singapore Grip\", or in M. Raihan Halim's Horror flick as the titular \"Ibu\", under heavy prosthetics, but you can always guarantee he steals the spotlight.",
      'cast.bio.marsha': 'Marsha Biddulph is a Malaysian actress and content creator. She began her acting career in 2024 and has since appeared in productions including Harimau Malaya, a Unifi series, a Viu series, and the upcoming films Tikus and Sujud Syaitan. Passionate about storytelling, she continues to build her career across film, television, and digital content.',
      'cast.bio.qiu': 'Qiu Qatina is a Malaysian actress and arts practitioner with over a decade of experiences in the performing arts industry. A graduate of University Teknologi MARA (UiTM) with a Bachelor’s Degree in Performing Arts and currently pursuing a Master’s in Creative Arts at ASWARA, she has built a diverse career spanning from theatre to drama and film. Qiu has involved in numerous acclaimed stage productions and screen projects while earning recognition. Rooted in both artistic practice and scholarly inquiry, Qiu’s creations are driven by the belief that art is not merely an act of expression but a process of self-discovery.\n\n“An artist does not create to escape reality, but to reveal the truths that silence cannot speak.”',
      'cast.bio.fattah': 'Fattah Fawzy is a Malaysian filmmaker, actor, theatre practitioner, and singer-songwriter. He believes in truthful and grounded performances, bringing honesty and careful preparation to every role. Alongside his work in film and theatre, he has also shared his experience through workshops, talks, and collaborations with students and aspiring filmmakers. His background as a writer and director has further shaped his approach to storytelling, both on stage and on screen.',
      'explorer.eyebrow': 'Samasihat Wellness Retreat',
      'explorer.heading': 'EVERYONE IN THE HOUSE IS A SUSPECT',
      'explorer.synopsis': "Mimi & Jay's dream wellness retreat becomes a horrible nightmare when a guest is brutally murdered. Cut off by floods and a fallen tree across the only access road, they face a chilling reality: the killer is among them, and everyone is a suspect.",
      'explorer.returnHouse': 'Return to House',
      'explorer.instructionHouse': 'Select the house to enter the Sitting Room.',
      'explorer.entryAria': 'Enter the house and open the Sitting Room',
      'explorer.enterHouse': 'Enter the house',
      'explorer.hotspotLayer': 'Interactive scene points',
      'scene.house.eyebrow': 'SAMASIHAT WELLNESS RETREAT',
      'scene.house.title': 'The House',
      'scene.house.hint': 'Select the house to enter the Sitting Room.',
      'scene.house.alt': 'A wide retro illustration of the isolated Samasihat bungalow at night, surrounded by dark trees and a crimson sky.',
      'scene.sitting.eyebrow': 'INSIDE SAMASIHAT',
      'scene.sitting.title': 'Sitting Room',
      'scene.sitting.hint': 'Select a pulsing point to play a game.',
      'scene.sitting.alt': 'A straight-on retro illustration of the Samasihat Sitting Room, with sofas, inherited artwork, a cabinet and warm crimson lighting.',
      'scene.hotspot.beat': 'Play Tikus Beat at the family console',
      'scene.hotspot.slider': 'Play Tikus Slider at the inherited painting',
      'scene.hotspot.rush': 'Play Tikus Rush at the main sofa',
      'scene.loadedHotspots': '{title} loaded. {count} interactive hotspots available. {hint}',
      'scene.loadedExterior': '{title} exterior loaded. {hint}',
      'film.eyebrow': 'Film information',
      'film.heading': 'More from TIKUS',
      'film.releaseDate': 'Release date',
      'film.toBeAnnounced': 'To be announced',
      'film.socialMedia': 'Social media',
      'film.urlPending': 'URL pending',
      'film.pressKit': 'Press kit',
      'film.downloadPending': 'Download pending',
      'footer.backTop': 'Back to top',
      'dialog.closeInfo': 'Close information panel',
      'dialog.escapeClose': 'Press Escape to close.',
      'dialog.gameEyebrow': 'SAMASIHAT AFTER DARK',
      'dialog.gameTitle': 'TIKUS Game',
      'dialog.gameClose': 'Close game and return to the Sitting Room',
      'dialog.gameDescription': 'A spoiler-safe, non-canonical TIKUS game.',
      'dialog.gameUnavailable': 'This game is temporarily unavailable.',
      'game.rush.title': 'Tikus Rush', 'game.beat.title': 'Tikus Beat', 'game.slider.title': 'Tikus Slider',
      'app.explorerError': 'The house explorer could not be initialised. Please reload the page.',

      'common.score': 'Score', 'common.time': 'Time', 'common.best': 'Best',
      'common.playAgain': 'Play again', 'common.returnSitting': 'Return to Sitting Room',
      'common.backSitting': '← Sitting Room',
      'common.bestScore': 'Best score: {score}',

      'rush.challenge': '30-SECOND CHALLENGE',
      'rush.arcadeEyebrow': '30-SECOND ARCADE',
      'rush.streak': 'Streak',
      'rush.arena': 'Mouse-catching arena',
      'rush.kicker': 'THE HOUSE IS CRAWLING',
      'rush.description': 'Catch as many mice as possible before time runs out. They dart in unpredictable directions, but the pace stays playful and forgiving.',
      'rush.greyMouse': 'Grey mouse', 'rush.goldMouse': 'Gold mouse',
      'rush.start': 'Start the rush',
      'rush.timeUp': 'TIME IS UP',
      'rush.escaped': 'The mice escaped.',
      'rush.caught': '{type} mouse caught. {points} points. Score {score}.',
      'rush.streakCallout': '{count} STREAK',
      'rush.mouseAria': '{type} mouse, worth {points} points',
      'rush.breakdown': '{grey} grey · {gold} gold · best streak {streak}',
      'rush.newRecord': 'New house record.',
      'rush.registryDescription': 'Catch grey and gold mice as they dart along unpredictable paths at a playful pace.',
      'rush.duration': '30 sec',
      'rush.controls': 'Tap, click or keyboard',

      'beat.eyebrow': '60-SECOND RHYTHM',
      'beat.combo': 'Combo', 'beat.tempo': 'Tempo',
      'beat.tempoEasy': 'Easy', 'beat.tempoSteady': 'Steady', 'beat.tempoUpbeat': 'Upbeat', 'beat.tempoFinale': 'Finale',
      'beat.audioOn': 'Audio on', 'beat.audioOff': 'Audio off', 'beat.noAudio': 'No audio',
      'beat.audioToggle': 'Turn Tikus Beat music and sound effects {state}',
      'beat.audioUnavailable': 'Tikus Beat audio is unavailable in this browser',
      'beat.stateOn': 'on', 'beat.stateOff': 'off',
      'beat.stageAria': 'Five-lane rhythm game',
      'beat.laneAria': 'Lane {lane}, {weapon}. Keys {number} or {letter}',
      'beat.follow': 'FOLLOW THE FALLING OBJECTS',
      'beat.description': 'Tap the matching lane as an object reaches the crimson hit area. The notes move at a gentler pace, and early taps receive a small input buffer.',
      'beat.soundNote': 'A lightweight music loop plus hit, combo and final-score sounds begin only after you press Start. Use the Audio control at any time.',
      'beat.soundUnsupported': 'This browser does not provide the audio features used by Tikus Beat.',
      'beat.start': 'Start the beat',
      'beat.final': 'FINAL BEAT',
      'beat.fades': 'The rhythm fades.',
      'beat.perfect': 'PERFECT', 'beat.good': 'GOOD', 'beat.miss': 'MISS',
      'beat.blast': '20 HIT BLAST',
      'beat.blastAnnounce': 'Twenty hit streak. Every visible object cleared.',
      'beat.hitAnnounce': '{type}. Combo {combo}. Score {score}.',
      'beat.comboCallout': '{combo} COMBO',
      'beat.pickingUp': 'PICKING UP', 'beat.upbeat': 'UPBEAT', 'beat.finalPush': 'FINAL PUSH',
      'beat.breakdown': '{perfect} perfect · {good} good · {miss} miss · max combo {combo}',
      'beat.newRecord': 'New rhythm record.',
      'beat.registryDescription': 'Match five falling objects through a gentler, more forgiving rhythm curve.',
      'beat.duration': '60 sec',
      'beat.controls': 'Tap lanes or use 1–5 / A/S/D/F/G',
      'beat.weapon.pipe': 'Iron pipe', 'beat.weapon.wrench': 'Adjustable wrench',
      'beat.weapon.candlestick': 'Brass candlestick', 'beat.weapon.knife': 'Kitchen knife',
      'beat.weapon.cord': 'Telephone cord',

      'slider.eyebrow': '3 × 3 PAINTING PUZZLE',
      'slider.intro': 'Restore the Samasihat painting. Select a tile beside the empty space, or focus the board and use the arrow keys.',
      'slider.boardAria': 'Three by three sliding picture puzzle',
      'slider.controlsAria': 'Puzzle controls',
      'slider.moves': 'Moves',
      'slider.shuffle': 'Shuffle & Start',
      'slider.preview': 'Hold to Preview',
      'slider.reset': 'Reset',
      'slider.ready': 'The painting is ready. Shuffle to begin.',
      'slider.howTo': 'How to play',
      'slider.help': 'Move a tile into the empty square until the full painting is restored. Arrow keys move the adjacent tile toward the empty square while the board is focused.',
      'slider.restored': 'PAINTING RESTORED',
      'slider.complete': 'Puzzle Complete',
      'slider.solved': 'You solved it.',
      'slider.playAgain': 'Play Again',
      'slider.tileAria': 'Painting tile {number}',
      'slider.inProgress': 'Puzzle in progress.',
      'slider.shuffled': 'Puzzle shuffled. Restore the painting.',
      'slider.resetStatus': 'The painting has been reset. Shuffle to begin.',
      'slider.result': 'Painting restored in {moves} moves and {time}.',
      'slider.resultAnnounce': 'You restored the painting in {moves} moves and {time}.{record}',
      'slider.newBestSuffix': ' New best result.',
      'slider.paused': 'Puzzle paused while this tab is hidden.',
      'slider.resumed': 'Puzzle resumed.',
      'slider.bestMoves': '{moves} moves',
      'slider.registryDescription': 'Restore the Samasihat painting by sliding eight tiles into place.',
      'slider.duration': 'Untimed',
      'slider.controls': 'Tap adjacent tiles or use arrow keys'
    }),

    ms: Object.freeze({
      'meta.title': 'TIKUS — Mikrosite Rasmi Filem',
      'meta.description': 'Masuki Pusat Percutian Kesihatan Samasihat dalam mikrosite interaktif rasmi TIKUS, sebuah filem Feisk Productions.',
      'language.switchToMs': 'Language: English. Switch to Bahasa Malaysia.',
      'language.switchToEn': 'Bahasa: Bahasa Malaysia. Tukar ke English.',
      'site.skipExplorer': 'Langkau ke penerokaan rumah',
      'hero.welcome': 'Selamat Datang ke Pusat Percutian Kesihatan Samasihat',
      'hero.headline': 'Hujung minggu baru sahaja bermula.',
      'hero.support': 'Sebuah rumah dipenuhi orang asing. Seorang pembunuh di antara mereka.',
      'site.feiskFilm': 'Sebuah filem Feisk Productions',
      'hero.watchTrailer': 'Tonton treler',
      'hero.scrollTrailer': 'Tatal untuk menonton treler',
      'trailer.nowShowing': 'Kini ditayangkan',
      'trailer.heading': 'Tonton treler',
      'trailer.description': 'Saksikan TIKUS melalui sebuah televisyen dari zaman lain. Video hanya dimainkan selepas anda memilih untuk menonton.',
      'trailer.playerLabel': 'Pemain treler televisyen retro',
      'trailer.playOfficial': 'Mainkan treler rasmi',
      'trailer.playOfficialAria': 'Mainkan treler rasmi TIKUS',
      'trailer.note': 'Video ini dihoskan oleh YouTube. Tiada video dimuatkan sehingga televisyen dipilih.',
      'trailer.meetCast': 'Kenali barisan pelakon',
      'trailer.official': 'Treler rasmi',
      'trailer.dialogDescription': 'Pemain video YouTube untuk treler rasmi TIKUS.',
      'trailer.close': 'Tutup treler',
      'trailer.frameTitle': 'Treler rasmi TIKUS',
      'trailer.watchYoutube': 'Tonton terus di YouTube',
      'trailer.firstLook': 'Lihat pandangan pertama',
      'gallery.eyebrow': 'Daripada filem',
      'gallery.heading': 'PANDANGAN PERTAMA',
      'gallery.description': 'Pilihan gambar adegan daripada TIKUS. Pilih satu bingkai untuk melihatnya dengan lebih besar.',
      'gallery.enlarge': 'Besarkan',
      'gallery.previous': 'Gambar adegan sebelumnya',
      'gallery.next': 'Gambar adegan seterusnya',
      'gallery.filmstrip': 'Gambar kecil adegan filem TIKUS',
      'gallery.instruction': 'Pilih gambar kecil, gunakan kekunci anak panah, atau leret pada imej utama. Pilih imej besar untuk paparan skrin penuh.',
      'gallery.meetCast': 'Kenali barisan pelakon',
      'gallery.filmOverview': 'Maklumat filem',
      'overview.eyebrow': 'Maklumat filem',
      'overview.heading': 'TIKUS',
      'overview.synopsis': 'Sekumpulan tetamu yang menyertai program “healing” di sebuah tempat peranginan terkandas apabila hujan lebat memutuskan segala laluan keluar. Keadaan menjadi semakin meruncing apabila didedah ada seorang pembunuh di kalangan mereka.',
      'overview.posterAlt': 'Poster rasmi filem TIKUS dalam gaya kolaj merah, hitam dan tekstur kertas lusuh.',
      'overview.director': 'Pengarah',
      'overview.screenplay': 'Lakon Layar',
      'overview.producers': 'Penerbit',
      'overview.executiveProducers': 'Penerbit Eksekutif',
      'overview.productionCompany': 'Syarikat Penerbit',
      'overview.cast': 'Pelakon',
      'overview.social': 'Media Sosial',
      'overview.imdb': 'Lihat di IMDb',
      'overview.imdbAria': 'Buka halaman TIKUS di IMDb dalam tab baharu',
      'overview.instagramAria': 'Buka Feisk Productions di Instagram dalam tab baharu',
      'overview.threadsAria': 'Buka Feisk Productions di Threads dalam tab baharu',
      'overview.hashtags': 'Hashtag kempen',
      'overview.meetCast': 'Kenali barisan pelakon',
      'gallery.dialogEyebrow': 'Gambar adegan filem TIKUS',
      'gallery.dialogDescription': 'Galeri skrin penuh gambar adegan TIKUS. Gunakan butang sebelumnya dan seterusnya atau kekunci anak panah kiri dan kanan untuk melihat gambar.',
      'gallery.dialogHint': 'Leret atau guna ← → untuk melihat gambar. Tekan Escape untuk tutup.',
      'gallery.close': 'Tutup galeri pandangan pertama',
      'gallery.openAria': 'Buka gambar adegan {index} daripada {total} dengan lebih besar',
      'gallery.thumbAria': 'Paparkan gambar adegan {index} daripada {total}',
      'gallery.status': 'Memaparkan gambar adegan {index} daripada {total}.',
      'gallery.alt.1': 'Gambar pandangan pertama TIKUS yang menunjukkan bahagian luar pusat percutian dikelilingi kehijauan rimbun.',
      'gallery.alt.2': 'Gambar pandangan pertama TIKUS yang menunjukkan sekumpulan orang berkumpul dengan tegang di dalam pusat percutian.',
      'gallery.alt.3': 'Gambar pandangan pertama TIKUS yang menunjukkan dua wanita duduk bersama di dalam Samasihat.',
      'gallery.alt.4': 'Gambar pandangan pertama TIKUS yang menunjukkan beberapa orang bereaksi dengan tegang di dalam pusat percutian.',
      'gallery.alt.5': 'Gambar pandangan pertama TIKUS yang menunjukkan dua susuk berhadapan dalam cahaya belakang yang hangat.',
      'gallery.alt.6': 'Gambar pandangan pertama TIKUS yang menunjukkan sebuah telefon di sebelah lampu meja yang menyala.',
      'gallery.alt.7': 'Gambar pandangan pertama TIKUS yang menunjukkan tiga orang bereaksi cemas di sebuah pintu dalaman.',
      'cinema.eyebrow': 'Lokasi tayangan',
      'cinema.heading': '22 pawagam seluruh negara',
      'cinema.intro': 'Pilih negeri untuk melihat pawagam yang mengambil bahagian, alamat dan arah perjalanan.',
      'cinema.cinemas': 'Pawagam',
      'cinema.independent': 'Bebas',
      'cinema.statsLabel': 'Rangkaian tayangan TIKUS: 22 pawagam, 13 GSC, 6 TGV dan 3 pawagam bebas',
      'cinema.selectorLabel': 'Pilih negeri anda',
      'cinema.selectorHelp': 'Pilih negeri atau wilayah untuk melihat pawagam yang mengambil bahagian.',
      'cinema.chooseState': 'Pilih negeri',
      'cinema.empty': 'Pilih negeri untuk melihat lokasi pawagam.',
      'cinema.locationCount': '{count} lokasi',
      'cinema.openMap': 'Buka dalam Maps',
      'cinema.openMapAria': 'Buka {cinema} dalam Google Maps',
      'cinema.status': '{count} lokasi pawagam dipaparkan untuk {state}.',
      'cinema.disclaimer': 'Lokasi pawagam berdasarkan senarai tayangan TIKUS. Jadual boleh berubah, jadi semak sebelum bertolak.',
      'cast.eyebrow': 'Pelakon',
      'cast.heading': 'Kenali barisan pelakon',
      'cast.intro': 'Pilih potret untuk membaca lebih lanjut tentang pelakon.',
      'cast.tableLabel': 'Kad potret barisan pelakon',
      'cast.instruction': 'Pilih kad untuk membaca profil pelakon. Pilih sekali lagi untuk kembali ke potret.',
      'cast.enterHouse': 'Masuk ke rumah',
      'cast.portraitPlaceholder': 'Ruang potret {name}',
      'cast.portraitComing': 'Potret akan datang',
      'cast.profileComing': 'Profil akan datang.',
      'cast.bioLabel': 'Profil pelakon',
      'cast.revealBio': 'Baca profil',
      'cast.returnPortrait': 'Kembali ke potret',
      'cast.frontAria': '{actor}. Balikkan kad untuk membaca profil pelakon.',
      'cast.backAria': 'Profil {actor}. Balikkan kad untuk kembali ke potret.',
      'cast.frontStatus': 'Memaparkan potret {actor}.',
      'cast.backStatus': 'Memaparkan profil pelakon {actor}.',
      'cast.bio.yMun': 'Saya Nicholas Chin, dan TIKUS ialah filem cereka pertama saya. Saya memang sentiasa meminati filem dan pernah terlibat sedikit dalam teater semasa di kolej. Terpilih untuk watak ini merupakan satu detik yang sangat tidak dijangka dan mengujakan bagi saya, dan sejujurnya keseluruhan proses daripada uji bakat hingga penggambaran telah mengajar saya begitu banyak. Saya sangat bersyukur menjadi sebahagian daripada projek ini dan tidak sabar untuk orang ramai akhirnya menontonnya!',
      'cast.bio.haiccal': 'Haiccal Hazim ialah seorang pelakon Malaysia, pelakon pentas, model, bakat komersial dan hos yang bersemangat menghidupkan watak-watak yang jujur dan dekat dengan penonton. Dengan pengalaman dalam teater, filem dan produksi komersial, beliau gemar bekerjasama dengan pasukan kreatif serta menyahut cabaran baharu di dalam dan di luar set. Komitmennya terhadap perkembangan berterusan dan penceritaan telah membolehkannya terlibat dalam pelbagai projek, dan beliau berharap dapat terus berhubung dengan penonton melalui setiap watak yang dibawakannya.',
      'cast.bio.diana': 'Pada usia 73 tahun, Diana Ooi membuktikan bahawa tidak pernah terlambat untuk mengejar panggilan hidup. Selepas menamatkan kerjaya keduanya pada 2020, beliau terus beralih kepada minat berlakon yang dipendam sejak kecil. Hanya setahun kemudian, beliau membuat penampilan sulung layar yang menyerlah dengan memainkan watak yang menghidap demensia dalam sebuah penyertaan Short + Sweet Malaysia, sekali gus memperkenalkan dirinya sebagai bakat yang meyakinkan dan autentik',
      'cast.bio.iski': 'Iski Senna ialah seorang penggiat teater, penari Tango dan guru drama. Dari Istana Budaya ke ITV UK, Netflix hingga Nueve de Julio Avenue, himpunan kemahirannya telah membawanya ke pelbagai tempat, kebanyakannya tidak dijangka.\n\nAnda mungkin pernah melihatnya dalam watak-watak kecil dalam \"Marco Polo\" di Netflix dan \"The Singapore Grip\" di ITV, atau dalam filem seram M. Raihan Halim sebagai watak utama \"Ibu\" di bawah solekan prostetik yang berat, tetapi anda sentiasa boleh menjangkakan dia mencuri perhatian.',
      'cast.bio.marsha': 'Marsha Biddulph ialah seorang pelakon dan pencipta kandungan Malaysia. Beliau memulakan kerjaya lakonan pada 2024 dan sejak itu telah muncul dalam produksi termasuk Harimau Malaya, sebuah siri Unifi, sebuah siri Viu, serta filem akan datang Tikus dan Sujud Syaitan. Bersemangat terhadap penceritaan, beliau terus membina kerjayanya merentasi filem, televisyen dan kandungan digital.',
      'cast.bio.qiu': 'Qiu Qatina ialah seorang pelakon dan penggiat seni Malaysia dengan pengalaman lebih sedekad dalam industri seni persembahan. Graduan Universiti Teknologi MARA (UiTM) dengan Ijazah Sarjana Muda Seni Persembahan dan kini sedang mengikuti pengajian Sarjana Seni Kreatif di ASWARA, beliau telah membina kerjaya yang pelbagai merangkumi teater, drama dan filem. Qiu telah terlibat dalam pelbagai produksi pentas yang mendapat pengiktirafan serta projek layar sambil meraih perhatian atas hasil kerjanya. Berakar pada amalan seni dan penyelidikan ilmiah, karya Qiu didorong oleh kepercayaan bahawa seni bukan sekadar tindakan meluahkan perasaan, tetapi satu proses penemuan diri.\n\n“Seorang seniman tidak berkarya untuk melarikan diri daripada realiti, tetapi untuk menyingkap kebenaran yang tidak mampu diungkapkan oleh kesunyian.”',
      'cast.bio.fattah': 'Fattah Fawzy ialah seorang pembikin filem, pelakon, penggiat teater dan penyanyi-penulis lagu Malaysia. Beliau mempercayai persembahan yang jujur dan berpijak pada realiti, serta membawa keikhlasan dan persediaan teliti kepada setiap watak. Di samping kerjanya dalam filem dan teater, beliau turut berkongsi pengalaman melalui bengkel, ceramah dan kerjasama dengan pelajar serta pembikin filem baharu. Latar belakangnya sebagai penulis dan pengarah turut membentuk pendekatannya terhadap penceritaan, sama ada di pentas mahupun di layar.',
      'explorer.eyebrow': 'Pusat Percutian Kesihatan Samasihat',
      'explorer.heading': 'SEMUA ORANG DI DALAM RUMAH ADALAH SUSPEK',
      'explorer.synopsis': 'Impian Mimi & Jay untuk membuka pusat percutian kesihatan bertukar menjadi mimpi ngeri apabila seorang tetamu dibunuh dengan kejam. Terputus hubungan akibat banjir dan sebatang pokok tumbang merentangi satu-satunya jalan masuk, mereka berdepan hakikat yang menggerunkan: pembunuh itu berada di antara mereka, dan semua orang adalah suspek.',
      'explorer.returnHouse': 'Kembali ke Rumah',
      'explorer.instructionHouse': 'Pilih rumah untuk masuk ke Ruang Tamu.',
      'explorer.entryAria': 'Masuk ke rumah dan buka Ruang Tamu',
      'explorer.enterHouse': 'Masuk ke rumah',
      'explorer.hotspotLayer': 'Titik interaktif dalam babak',
      'scene.house.eyebrow': 'PUSAT PERCUTIAN KESIHATAN SAMASIHAT',
      'scene.house.title': 'Rumah',
      'scene.house.hint': 'Pilih rumah untuk masuk ke Ruang Tamu.',
      'scene.house.alt': 'Ilustrasi retro rumah banglo Samasihat yang terpencil pada waktu malam, dikelilingi pokok gelap dan langit merah tua.',
      'scene.sitting.eyebrow': 'DI DALAM SAMASIHAT',
      'scene.sitting.title': 'Ruang Tamu',
      'scene.sitting.hint': 'Pilih titik berdenyut untuk bermain.',
      'scene.sitting.alt': 'Ilustrasi retro pandangan hadapan Ruang Tamu Samasihat, dengan sofa, karya seni pusaka, kabinet dan pencahayaan merah hangat.',
      'scene.hotspot.beat': 'Main Tikus Beat di konsol keluarga',
      'scene.hotspot.slider': 'Main Tikus Slider pada lukisan pusaka',
      'scene.hotspot.rush': 'Main Tikus Rush di sofa utama',
      'scene.loadedHotspots': '{title} dimuatkan. {count} titik interaktif tersedia. {hint}',
      'scene.loadedExterior': 'Bahagian luar {title} dimuatkan. {hint}',
      'film.eyebrow': 'Maklumat filem',
      'film.heading': 'Lagi daripada TIKUS',
      'film.releaseDate': 'Tarikh tayangan',
      'film.toBeAnnounced': 'Akan diumumkan',
      'film.socialMedia': 'Media sosial',
      'film.urlPending': 'URL akan diumumkan',
      'film.pressKit': 'Kit media',
      'film.downloadPending': 'Muat turun akan datang',
      'footer.backTop': 'Kembali ke atas',
      'dialog.closeInfo': 'Tutup panel maklumat',
      'dialog.escapeClose': 'Tekan Escape untuk tutup.',
      'dialog.gameEyebrow': 'SAMASIHAT SELEPAS GELAP',
      'dialog.gameTitle': 'Permainan TIKUS',
      'dialog.gameClose': 'Tutup permainan dan kembali ke Ruang Tamu',
      'dialog.gameDescription': 'Permainan TIKUS yang bebas spoiler dan bukan kanon.',
      'dialog.gameUnavailable': 'Permainan ini tidak tersedia buat sementara waktu.',
      'game.rush.title': 'Tikus Rush', 'game.beat.title': 'Tikus Beat', 'game.slider.title': 'Tikus Slider',
      'app.explorerError': 'Penerokaan rumah tidak dapat dimulakan. Sila muat semula halaman.',

      'common.score': 'Markah', 'common.time': 'Masa', 'common.best': 'Terbaik',
      'common.playAgain': 'Main lagi', 'common.returnSitting': 'Kembali ke Ruang Tamu',
      'common.backSitting': '← Ruang Tamu',
      'common.bestScore': 'Markah terbaik: {score}',

      'rush.challenge': 'CABARAN 30 SAAT',
      'rush.arcadeEyebrow': 'ARKED 30 SAAT',
      'rush.streak': 'Rentetan',
      'rush.arena': 'Arena menangkap tikus',
      'rush.kicker': 'RUMAH INI DIPENUHI TIKUS',
      'rush.description': 'Tangkap sebanyak mungkin tikus sebelum masa tamat. Mereka bergerak dalam arah yang sukar dijangka, tetapi rentaknya kekal santai dan mudah dimainkan.',
      'rush.greyMouse': 'Tikus kelabu', 'rush.goldMouse': 'Tikus emas',
      'rush.start': 'Mulakan permainan',
      'rush.timeUp': 'MASA TAMAT',
      'rush.escaped': 'Tikus-tikus terlepas.',
      'rush.caught': '{type} ditangkap. {points} mata. Markah {score}.',
      'rush.streakCallout': 'RENTETAN {count}',
      'rush.mouseAria': '{type}, bernilai {points} mata',
      'rush.breakdown': '{grey} kelabu · {gold} emas · rentetan terbaik {streak}',
      'rush.newRecord': 'Rekod rumah baharu.',
      'rush.registryDescription': 'Tangkap tikus kelabu dan emas yang bergerak melalui laluan sukar dijangka pada rentak yang santai.',
      'rush.duration': '30 saat',
      'rush.controls': 'Ketik, klik atau papan kekunci',

      'beat.eyebrow': 'IRAMA 60 SAAT',
      'beat.combo': 'Kombo', 'beat.tempo': 'Tempo',
      'beat.tempoEasy': 'Mudah', 'beat.tempoSteady': 'Stabil', 'beat.tempoUpbeat': 'Rancak', 'beat.tempoFinale': 'Finale',
      'beat.audioOn': 'Audio hidup', 'beat.audioOff': 'Audio mati', 'beat.noAudio': 'Tiada audio',
      'beat.audioToggle': '{state} muzik dan kesan bunyi Tikus Beat',
      'beat.audioUnavailable': 'Audio Tikus Beat tidak tersedia dalam pelayar ini',
      'beat.stateOn': 'Hidupkan', 'beat.stateOff': 'Matikan',
      'beat.stageAria': 'Permainan irama lima lorong',
      'beat.laneAria': 'Lorong {lane}, {weapon}. Kekunci {number} atau {letter}',
      'beat.follow': 'IKUT OBJEK YANG JATUH',
      'beat.description': 'Ketik lorong yang sepadan apabila objek sampai ke kawasan sasaran merah. Nota bergerak pada rentak lebih perlahan dan ketikan awal diberi sedikit ruang masa.',
      'beat.soundNote': 'Gelung muzik ringan serta bunyi pukulan, kombo dan markah akhir hanya bermula selepas anda menekan Mula. Gunakan kawalan Audio pada bila-bila masa.',
      'beat.soundUnsupported': 'Pelayar ini tidak menyediakan ciri audio yang digunakan oleh Tikus Beat.',
      'beat.start': 'Mulakan irama',
      'beat.final': 'IRAMA TERAKHIR',
      'beat.fades': 'Irama semakin perlahan.',
      'beat.perfect': 'SEMPURNA', 'beat.good': 'BAIK', 'beat.miss': 'TERLEPAS',
      'beat.blast': 'LETUPAN 20 PUKULAN',
      'beat.blastAnnounce': 'Rentetan dua puluh pukulan. Semua objek yang kelihatan dibersihkan.',
      'beat.hitAnnounce': '{type}. Kombo {combo}. Markah {score}.',
      'beat.comboCallout': 'KOMBO {combo}',
      'beat.pickingUp': 'SEMAKIN PANTAS', 'beat.upbeat': 'RANCAK', 'beat.finalPush': 'PUSINGAN AKHIR',
      'beat.breakdown': '{perfect} sempurna · {good} baik · {miss} terlepas · kombo maksimum {combo}',
      'beat.newRecord': 'Rekod irama baharu.',
      'beat.registryDescription': 'Padankan lima objek jatuh melalui lengkung irama yang lebih perlahan dan mudah dimainkan.',
      'beat.duration': '60 saat',
      'beat.controls': 'Ketik lorong atau guna 1–5 / A/S/D/F/G',
      'beat.weapon.pipe': 'Paip besi', 'beat.weapon.wrench': 'Sepana boleh laras',
      'beat.weapon.candlestick': 'Kaki lilin loyang', 'beat.weapon.knife': 'Pisau dapur',
      'beat.weapon.cord': 'Kabel telefon',

      'slider.eyebrow': 'TEKA-TEKI LUKISAN 3 × 3',
      'slider.intro': 'Pulihkan lukisan Samasihat. Pilih jubin di sebelah ruang kosong, atau fokus pada papan dan gunakan kekunci anak panah.',
      'slider.boardAria': 'Teka-teki gambar gelangsar tiga kali tiga',
      'slider.controlsAria': 'Kawalan teka-teki',
      'slider.moves': 'Langkah',
      'slider.shuffle': 'Kocok & Mula',
      'slider.preview': 'Tahan untuk Pratonton',
      'slider.reset': 'Tetapkan semula',
      'slider.ready': 'Lukisan sudah sedia. Kocok untuk bermula.',
      'slider.howTo': 'Cara bermain',
      'slider.help': 'Gerakkan jubin ke ruang kosong sehingga seluruh lukisan dipulihkan. Kekunci anak panah menggerakkan jubin bersebelahan ke arah ruang kosong apabila papan difokuskan.',
      'slider.restored': 'LUKISAN DIPULIHKAN',
      'slider.complete': 'Teka-teki Selesai',
      'slider.solved': 'Anda berjaya menyelesaikannya.',
      'slider.playAgain': 'Main Lagi',
      'slider.tileAria': 'Jubin lukisan {number}',
      'slider.inProgress': 'Teka-teki sedang dimainkan.',
      'slider.shuffled': 'Teka-teki dikocok. Pulihkan lukisan.',
      'slider.resetStatus': 'Lukisan telah ditetapkan semula. Kocok untuk bermula.',
      'slider.result': 'Lukisan dipulihkan dalam {moves} langkah dan {time}.',
      'slider.resultAnnounce': 'Anda memulihkan lukisan dalam {moves} langkah dan {time}.{record}',
      'slider.newBestSuffix': ' Keputusan terbaik baharu.',
      'slider.paused': 'Teka-teki dijeda semasa tab ini tersembunyi.',
      'slider.resumed': 'Teka-teki disambung semula.',
      'slider.bestMoves': '{moves} langkah',
      'slider.registryDescription': 'Pulihkan lukisan Samasihat dengan menggelongsorkan lapan jubin ke tempatnya.',
      'slider.duration': 'Tanpa had masa',
      'slider.controls': 'Ketik jubin bersebelahan atau gunakan kekunci anak panah'
    })
  });

  const listeners = new Set();
  let currentLanguage = readInitialLanguage();

  function readInitialLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.has(saved)) return saved;
    } catch (error) {
      // Storage is optional.
    }
    return 'en';
  }

  function interpolate(value, variables) {
    return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match;
    });
  }

  function t(key, variables = {}, fallback = '') {
    const value = translations[currentLanguage]?.[key]
      ?? translations.en[key]
      ?? fallback
      ?? key;
    return interpolate(value, variables);
  }

  function elements(root, selector) {
    const list = [];
    if (root instanceof Element && root.matches(selector)) list.push(root);
    if (root?.querySelectorAll) list.push(...root.querySelectorAll(selector));
    return list;
  }

  function applyStatic(root = document) {
    elements(root, '[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n, {}, element.textContent);
    });
    elements(root, '[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel, {}, element.getAttribute('aria-label') || ''));
    });
    elements(root, '[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle, {}, element.getAttribute('title') || ''));
    });
    elements(root, '[data-i18n-alt]').forEach((element) => {
      element.setAttribute('alt', t(element.dataset.i18nAlt, {}, element.getAttribute('alt') || ''));
    });
    elements(root, '[data-i18n-content]').forEach((element) => {
      element.setAttribute('content', t(element.dataset.i18nContent, {}, element.getAttribute('content') || ''));
    });
  }

  function updateToggle() {
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      const isMalay = currentLanguage === 'ms';
      button.setAttribute('aria-checked', String(isMalay));
      button.dataset.language = currentLanguage;
      button.setAttribute('aria-label', t(isMalay ? 'language.switchToEn' : 'language.switchToMs'));
      button.setAttribute('title', t(isMalay ? 'language.switchToEn' : 'language.switchToMs'));
    });
  }

  function applyDocumentLanguage() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dataset.language = currentLanguage;
    document.title = t('meta.title');
    applyStatic(document);
    updateToggle();
  }

  function setLanguage(language, options = {}) {
    const next = SUPPORTED.has(language) ? language : 'en';
    if (next === currentLanguage && !options.force) return;
    currentLanguage = next;
    try {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (error) {
      // Storage is optional.
    }
    applyDocumentLanguage();
    listeners.forEach((listener) => {
      try { listener(currentLanguage); } catch (error) { console.error(error); }
    });
    document.dispatchEvent(new CustomEvent('tikuslanguagechange', { detail: { language: currentLanguage } }));
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function init() {
    applyDocumentLanguage();
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        setLanguage(currentLanguage === 'en' ? 'ms' : 'en');
      });
    });
  }

  global.TikusI18n = Object.freeze({
    t,
    setLanguage,
    subscribe,
    applyStatic,
    get language() { return currentLanguage; }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
