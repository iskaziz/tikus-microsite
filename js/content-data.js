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

  const scenes = {
    house: {
      id: 'house',
      eyebrow: 'SAMASIHAT WELLNESS RETREAT',
      title: 'The House',
      introduction: 'Choose a room below to step inside.',
      alt: 'A wide retro illustration of the isolated Samasihat bungalow at night, surrounded by dark trees and crimson sky.',
      image: imageSet('samasihat-house-exterior'),
      hotspots: []
    },

    'sitting-room': {
      id: 'sitting-room',
      eyebrow: 'INSIDE SAMASIHAT',
      title: 'Sitting Room',
      introduction: 'Once the heart of a family home, the Sitting Room now carries Samasihat between eras: inherited furniture, accumulated art and the modest signs of a newly opened retreat. It is where welcomes are performed, personalities collide and the house first begins to feel smaller.',
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
    },

    kitchen: {
      id: 'kitchen',
      eyebrow: 'INSIDE SAMASIHAT',
      title: 'Kitchen',
      introduction: 'The Kitchen is Mimi’s centre of control: meals prepared ahead, provisions kept close and every detail arranged to make the retreat appear ready. Beyond the back door, however, the weather is already undoing the plan.',
      alt: 'A wide retro illustration of the Samasihat Kitchen, showing a cooking range, refrigerator, central worktable and a dark rear doorway.',
      image: imageSet('samasihat-kitchen'),
      hotspots: [
        {
          id: 'cooking-pot',
          x: 19,
          y: 48,
          label: 'Explore the cooking pot',
          subject: 'Cooking pot',
          eyebrow: 'MIMI’S PLAN',
          title: 'Prepared in Advance',
          body: 'Mimi has cooked several different dishes before the retreat begins and frozen them in case floodwater cuts off the property. For her, careful preparation is part hospitality and part insurance against everything going wrong.'
        },
        {
          id: 'provisions',
          x: 60,
          y: 46,
          label: 'Explore the refrigerator and provisions',
          subject: 'Provisions',
          eyebrow: 'CUT OFF',
          title: 'How Long Can the House Hold?',
          body: 'Food stores that seemed excessive at the start of the weekend become increasingly practical once heavy rain, flooding and a fallen tree make the road impassable.'
        },
        {
          id: 'back-door',
          x: 78,
          y: 44,
          label: 'Explore the back door',
          subject: 'Back door',
          eyebrow: 'AN UNEXPECTED GUEST',
          title: 'Someone From the Storm',
          body: 'A stranger appears in the middle of the bad weather, claiming that his motorcycle has been lost to flash flooding. He needs shelter until the water subsides and access is restored.'
        }
      ]
    },

    'orchid-room': {
      id: 'orchid-room',
      eyebrow: 'INSIDE SAMASIHAT',
      title: 'Orchid Room',
      introduction: 'Close to the Sitting Room, the Orchid Room is a quieter remnant of the old family home. Its floral character recalls Mimi’s late grandmother, who cultivated orchids from seeds brought from her home area in Limbang.',
      alt: 'A wide retro illustration of the Orchid Room, with a bed, floral artwork, an upright suitcase and warm bedside lamp.',
      image: imageSet('samasihat-orchid-room'),
      hotspots: [
        {
          id: 'orchid-art',
          x: 27,
          y: 24,
          label: 'Explore the floral artwork',
          subject: 'Floral artwork',
          eyebrow: 'THE ORCHIDS',
          title: 'A Memory From Limbang',
          body: 'Mimi says her late grandmother loved growing orchids. The original seeds for this variety came from her grandmother’s home area in Limbang, carrying one place into the memory of another.'
        },
        {
          id: 'guest-suitcase',
          x: 41,
          y: 69,
          label: 'Explore the guest suitcase',
          subject: 'Guest suitcase',
          eyebrow: 'OPENING WEEKEND',
          title: 'The First Arrivals',
          body: 'This is one of the rooms prepared for Samasihat’s first paying guests. Mimi and Jay are new to hospitality and anxious for the retreat’s opening weekend to run smoothly.'
        },
        {
          id: 'bedside-promise',
          x: 80,
          y: 66,
          label: 'Explore the bedside lamp and books',
          subject: 'Bedside lamp and books',
          eyebrow: 'THE PROMISE',
          title: 'A Calm Weekend',
          body: 'Samasihat promises its visitors a calm, stress-free stay built around rest, movement and reconnection with nature. In the Orchid Room, that promise still appears possible—at least when the door first closes.'
        }
      ]
    }
  };

  global.TIKUS_CONTENT = Object.freeze({
    site: {
      title: 'TIKUS',
      baseDocumentTitle: 'TIKUS — Official Film Microsite',
      trailer: Object.freeze({
        youtubeId: '9sgXasrieAE',
        watchUrl: 'https://youtu.be/9sgXasrieAE',
        embedUrl: 'https://www.youtube-nocookie.com/embed/9sgXasrieAE?rel=0&modestbranding=1'
      })
    },
    sceneOrder: Object.freeze(['sitting-room', 'kitchen', 'orchid-room']),
    scenes: Object.freeze(scenes)
  });
})(window);
