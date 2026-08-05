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
    alt: `Illustrated portrait of ${characterName}`,
    altKey: 'cast.characterPortraitAlt',
    altName: characterName
  });

  const scenes = {
    house: {
      id: 'house',
      eyebrow: 'SAMASIHAT WELLNESS RETREAT',
      eyebrowKey: 'scene.house.eyebrow',
      title: 'The House',
      titleKey: 'scene.house.title',
      navigationHint: 'Select the house to enter the Sitting Room.',
      navigationHintKey: 'scene.house.hint',
      alt: 'A wide retro illustration of the isolated Samasihat bungalow at night, surrounded by dark trees and a crimson sky.',
      altKey: 'scene.house.alt',
      image: imageSet('samasihat-house-exterior'),
      hotspots: []
    },
    'sitting-room': {
      id: 'sitting-room',
      eyebrow: 'INSIDE SAMASIHAT',
      eyebrowKey: 'scene.sitting.eyebrow',
      title: 'Sitting Room',
      titleKey: 'scene.sitting.title',
      navigationHint: 'Select a pulsing point to play a game.',
      navigationHintKey: 'scene.sitting.hint',
      alt: 'A straight-on retro illustration of the Samasihat Sitting Room, with sofas, inherited artwork, a cabinet and warm crimson lighting.',
      altKey: 'scene.sitting.alt',
      image: imageSet('samasihat-sitting-room'),
      hotspots: [
        {
          id: 'tikus-beat',
          type: 'game',
          gameId: 'beat',
          x: 16,
          y: 56,
          label: 'Play Tikus Beat at the family console',
          labelKey: 'scene.hotspot.beat',
          subject: 'Tikus Beat'
        },
        {
          id: 'tikus-slider',
          type: 'game',
          gameId: 'slider',
          x: 59,
          y: 53,
          label: 'Play Tikus Slider at the inherited painting',
          labelKey: 'scene.hotspot.slider',
          subject: 'Tikus Slider'
        },
        {
          id: 'tikus-rush',
          type: 'game',
          gameId: 'rush',
          x: 72,
          y: 68,
          label: 'Play Tikus Rush at the main sofa',
          labelKey: 'scene.hotspot.rush',
          subject: 'Tikus Rush'
        }
      ]
    }
  };

  const cast = [
    {
      id: 'que',
      actorName: 'Que',
      portrait: characterPortraitSet('mimi', 'Mimi'),
      bio: 'Profile coming soon.',
      bioKey: 'cast.profileComing'
    },
    {
      id: 'y-mun',
      actorName: 'Y Mun',
      portrait: characterPortraitSet('jay', 'Jay'),
      bio: 'I’m Nicholas Chin, and TIKUS is my very first feature film. I’ve always loved films and did a bit of theatre in college. Getting cast in this role was such an unexpected and exciting moment for me, and honestly the whole process from auditions to filming has taught me so much. I’m really grateful to be part of this project and can’t wait for people to finally see it!',
      bioKey: 'cast.bio.yMun'
    },
    {
      id: 'fattah',
      actorName: 'Fattah',
      portrait: characterPortraitSet('saladin', 'Saladin'),
      bio: 'Profile coming soon.',
      bioKey: 'cast.profileComing'
    },
    {
      id: 'diana',
      actorName: 'Diana Ooi',
      portrait: characterPortraitSet('madam-boey', 'Madam Boey'),
      bio: 'At 73, Diana Ooi proves it is never too late to chase a lifelong calling. After stepping down from her second career in 2020, she immediately pivoted to her childhood passion for acting. Just a year later, she landed her standout screen debut playing a character with dementia in an entry for Short + Sweet Malaysia, establishing herself as a compelling, authentic talent',
      bioKey: 'cast.bio.diana'
    },
    {
      id: 'harris',
      actorName: 'Harris',
      portrait: characterPortraitSet('mejar-mansor', 'Major Mansor'),
      bio: 'Profile coming soon.',
      bioKey: 'cast.profileComing'
    },
    {
      id: 'marsha',
      actorName: 'Marsha',
      portrait: characterPortraitSet('alayna', 'Alayna'),
      bio: 'Marsha Biddulph is a Malaysian actress and content creator. She began her acting career in 2024 and has since appeared in productions including Harimau Malaya, a Unifi series, a Viu series, and the upcoming films Tikus and Sujud Syaitan. Passionate about storytelling, she continues to build her career across film, television, and digital content.',
      bioKey: 'cast.bio.marsha'
    },
    {
      id: 'iski',
      actorName: 'Iski Senna',
      portrait: characterPortraitSet('guy', 'Guy'),
      bio: 'Iski Senna is a Thespian, Tango Dancer and Drama teacher. From Istana Budaya to ITV UK, Netflix to Nueve de Julio Avenue, his particular set of skills has taken him to many places, mostly unexpected.\n\nYou might have seen him in bit parts on Netflix\'s "Marco Polo" and ITV\'s "The Singapore Grip", or in M. Raihan Halim\'s Horror flick as the titular "Ibu", under heavy prosthetics, but you can always guarantee he steals the spotlight.',
      bioKey: 'cast.bio.iski'
    },
    {
      id: 'haiccal',
      actorName: 'Haiccal',
      portrait: null,
      bio: 'Haiccal Hazim is a Malaysian actor, stage actor, model, commercial talent and a host, who is passionate about bringing honest and relatable characters to life. With experience in theatre, film, and commercial productions, he enjoys collaborating with creative teams and embracing new challenges both on and off screen. His commitment to continuous growth and storytelling has allowed him to work across a variety of projects, and he looks forward to connecting with audiences through every role he takes on.',
      bioKey: 'cast.bio.haiccal'
    }
  ];

  global.TIKUS_CONTENT = Object.freeze({
    site: Object.freeze({
      title: 'TIKUS',
      baseDocumentTitle: 'TIKUS — Official Film Microsite',
      baseDocumentTitleKey: 'meta.title',
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
