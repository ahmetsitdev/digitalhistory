// Basit örnek veri seti; id, baslik, baslangic, bitis (opsiyonel), kategori, etiketler
export const categories = {
  political: 'political',
  cultural: 'cultural',
  military: 'military',
}

export const events = [
  {
    id: 'evt-001',
    title: { tr: 'İstanbul’un Fethi', en: 'Conquest of Constantinople' },
    startYear: 1453,
    endYear: 1453,
    category: categories.military,
    tags: ['Osmanlı', 'Konstantinopolis'],
    description: {
      tr: 'Fatih Sultan Mehmet tarafından şehrin alınması.',
      en: 'City taken by Mehmed the Conqueror.',
    },
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-istanbul?auto=format&fit=crop&w=1200&q=60',
      },
    ],
  },
  {
    id: 'evt-002',
    title: {
      tr: 'Rönesans Başlangıcı (yaklaşık)',
      en: 'Start of the Renaissance (approx.)',
    },
    startYear: 1400,
    endYear: 1600,
    category: categories.cultural,
    tags: ['Avrupa', 'Sanat', 'Bilim'],
    description: {
      tr: 'Avrupa’da kültürel ve bilimsel canlanma dönemi.',
      en: 'A period of cultural and scientific revival in Europe.',
    },
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-renaissance?auto=format&fit=crop&w=1200&q=60',
      },
    ],
  },
  {
    id: 'evt-003',
    title: { tr: 'Fransız Devrimi', en: 'French Revolution' },
    startYear: 1789,
    endYear: 1799,
    category: categories.political,
    tags: ['Fransa', 'Devrim'],
    description: {
      tr: 'Monarşiden cumhuriyete geçiş süreci.',
      en: 'Transition from monarchy to republic.',
    },
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-revolution?auto=format&fit=crop&w=1200&q=60',
      },
    ],
  },
]

export function sortEventsChronologically(list) {
  return [...list].sort(
    (a, b) =>
      a.startYear - b.startYear ||
      (a.endYear ?? a.startYear) - (b.endYear ?? b.startYear)
  )
}

export function detectChronologyIssues(list) {
  const warnings = []
  // Sıra kontrolü
  for (let i = 1; i < list.length; i++) {
    if (list[i].startYear < list[i - 1].startYear) {
      warnings.push({ type: 'order', a: list[i - 1].id, b: list[i].id })
    }
  }
  // Örtüşme kontrolü
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const aStart = list[i].startYear
      const aEnd = list[i].endYear ?? list[i].startYear
      const bStart = list[j].startYear
      const bEnd = list[j].endYear ?? list[j].startYear
      if (aStart <= bEnd && bStart <= aEnd) {
        warnings.push({ type: 'overlap', a: list[i].id, b: list[j].id })
      }
    }
  }
  return warnings
}
