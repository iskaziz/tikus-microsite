(function registerTikusContent(global) {
  'use strict';

  const imageSet = (slug) => ({
    avif: {
      small: `assets/images/scenes/${slug}-960.avif`,
      large: `assets/images/scenes/${slug}-1600.avif`
    },
    webp: {
      small: `assets/images/scenes/${slug}-960.webp`,
      large: `assets/images/scenes/${slug}-1600.webp`
    },
    fallback: {
      small: `assets/images/scenes/${slug}-960.jpg`,
      large: `assets/images/scenes/${slug}-1600.jpg`
    },
    width: 1672,
    height: 941
  });

  const characterPortraitSet = (filename, characterName) => ({
    avif: `assets/images/characters/${filename}-480.avif 480w, assets/images/characters/${filename}-720.avif 720w`,
    webp: `assets/images/characters/${filename}-480.webp 480w, assets/images/characters/${filename}-720.webp 720w`,
    fallback: `assets/images/characters/${filename}-720.jpg`,
    fallbackSrcset: `assets/images/characters/${filename}-480.jpg 480w, assets/images/characters/${filename}-720.jpg 720w`,
    sizes: '(max-width: 48rem) min(44vw, 11rem), 16rem',
    width: 720,
    height: 720,
    alt: `Illustrated portrait of ${characterName}`
  });

  const scenes = {
    house: {
      id: 'house',
      eyebrow: 'SAMASIHAT WELLNESS RETREAT',
      title: 'The House',
      navigationHint: 'Select the house to enter the Sitting Room.',
      alt: 'A wide retro illustration of the isolated Samasihat bungalow at night, surrounded by dark trees and a crimson sky.',
      image: imageSet('samasihat-house-exterior'),
      hotspots: []
    },
    'sitting-room': {
      id: 'sitting-room',
      eyebrow: 'INSIDE SAMASIHAT',
      title: 'Sitting Room',
      navigationHint: 'Select a pulsing point to uncover its story.',
      alt: 'A straight-on retro illustration of the Samasihat Sitting Room, with sofas, inherited artwork, a cabinet and warm crimson lighting.',
      image: imageSet('samasihat-sitting-room'),
      hotspots: [
        {
          id: 'family-console',
          x: 16,
          y: 56,
          label: 'Explore the family console',
          subject: 'Family console',
          eyebrow: 'THE OLD HOUSE',
          title: 'Lived In, Not Staged',
          body: 'This bungalow has passed through generations of the same family. Its age is not concealed: the room carries the objects, habits and irregularities of a home that existed long before anyone called it a wellness retreat.'
        },
        {
          id: 'art-display',
          x: 59,
          y: 53,
          label: 'Explore the inherited art display',
          subject: 'Art display',
          eyebrow: 'AN INHERITED COLLECTION',
          title: 'Pictures With a Past',
          body: 'The paintings are part of the house’s identity rather than decorative dressing. They give Samasihat the feeling of a place collected over time—personal, unmistakably Malaysian and never entirely neutral.'
        },
        {
          id: 'main-sofa',
          x: 72,
          y: 68,
          label: 'Explore the main sofa',
          subject: 'Main sofa',
          eyebrow: 'FIRST IMPRESSIONS',
          title: 'Everyone Takes a Seat',
          body: 'Samasihat opens with a deliberately small first group of guests. In the Sitting Room, polite introductions quickly expose mismatched personalities, private irritations and the difficulty of sharing one house.'
        }
      ]
    }
  };

  const cast = [
    {
      id: 'que',
      group: 'hosts',
      actorName: 'Que',
      characterName: 'Mimi',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('mimi', 'Mimi'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'y-mun',
      group: 'hosts',
      actorName: 'Y Mun',
      characterName: 'Jay',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('jay', 'Jay'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'fattah',
      group: 'guests',
      actorName: 'Fattah',
      characterName: 'Saladin',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('saladin', 'Saladin'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'diana',
      group: 'guests',
      actorName: 'Diana',
      characterName: 'Madam Boey',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('madam-boey', 'Madam Boey'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'harris',
      group: 'guests',
      actorName: 'Harris',
      characterName: 'Major Mansor',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('mejar-mansor', 'Major Mansor'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'marsha',
      group: 'guests',
      actorName: 'Marsha',
      characterName: 'Alayna',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('alayna', 'Alayna'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'iski',
      group: 'guests',
      actorName: 'Iski',
      characterName: 'Guy',
      actorPortrait: null,
      characterPortrait: characterPortraitSet('guy', 'Guy'),
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character profile coming soon.'
    },
    {
      id: 'haiccal',
      group: 'inspector',
      actorName: 'Haiccal',
      characterName: 'Inspektor Mislan',
      actorPortrait: null,
      characterPortrait: null,
      actorDescription: 'Cast portrait and profile coming soon.',
      characterDescription: 'Character portrait and profile coming soon.'
    }
  ];

  global.TIKUS_CONTENT = Object.freeze({
    site: Object.freeze({
      title: 'TIKUS',
      baseDocumentTitle: 'TIKUS — Official Film Microsite',
      trailer: Object.freeze({
        youtubeId: '9sgXasrieAE',
        watchUrl: 'https://youtu.be/9sgXasrieAE',
        embedUrl: 'https://www.youtube-nocookie.com/embed/9sgXasrieAE?rel=0&modestbranding=1'
      })
    }),
    cast: Object.freeze(cast.map((member) => Object.freeze(member))),
    sceneOrder: Object.freeze(['sitting-room']),
    scenes: Object.freeze(scenes)
  });
})(window);
