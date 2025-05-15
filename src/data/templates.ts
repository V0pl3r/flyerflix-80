
export type Template = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description?: string; // Adding description as an optional property
  canvaUrl?: string;
  isPremium?: boolean;
  downloads?: number;
  isNew?: boolean;
  eventType?: 'baile-funk' | 'sertanejo' | 'aniversario' | 'eletronica' | 'pagode' | 'outros';
  weeklyPopular?: boolean;
  usedByCreators?: boolean;
  usageCount?: number;
};

export const featuredTemplates: Template[] = [
  {
    id: "1",
    title: "Neon Party Flyer",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "eletronica",
    weeklyPopular: true
  },
  {
    id: "2",
    title: "Summer Festival",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival",
    eventType: "outros",
    usedByCreators: true,
    usageCount: 156
  },
  {
    id: "3",
    title: "DJ Night Special",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Clubbing",
    eventType: "eletronica"
  },
  {
    id: "4",
    title: "Art Exhibit Opening",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Exposição",
    eventType: "outros"
  },
  {
    id: "5",
    title: "Rock Concert Live",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Show",
    eventType: "outros",
    weeklyPopular: true
  },
  {
    id: "6",
    title: "Corporate Gala",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Corporativo",
    eventType: "outros",
    usedByCreators: true,
    usageCount: 89
  },
  {
    id: "7",
    title: "Wedding Invitation",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Casamento",
    eventType: "outros"
  },
  {
    id: "8",
    title: "Food Festival",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia",
    eventType: "outros"
  }
];

export const newTemplates: Template[] = [
  {
    id: "9",
    title: "Spring Fashion Show",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Moda",
    isNew: true,
    eventType: "outros"
  },
  {
    id: "10",
    title: "Tech Conference",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Tecnologia",
    isNew: true,
    eventType: "outros"
  },
  {
    id: "11",
    title: "New Year Party",
    imageUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    isNew: true,
    eventType: "eletronica",
    weeklyPopular: true
  },
  {
    id: "12",
    title: "Yoga Retreat",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Bem-Estar",
    eventType: "outros"
  },
  {
    id: "13",
    title: "Charity Fundraiser",
    imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Beneficente",
    eventType: "outros"
  },
  {
    id: "14",
    title: "Halloween Special",
    imageUrl: "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Temático",
    eventType: "outros"
  },
  {
    id: "15",
    title: "Book Launch Event",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Literatura",
    eventType: "outros"
  },
  {
    id: "16",
    title: "Fitness Challenge",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Esporte",
    eventType: "outros"
  }
];

export const popularTemplates: Template[] = [
  {
    id: "17",
    title: "House Music Festival",
    imageUrl: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival",
    eventType: "eletronica",
    weeklyPopular: true,
    usedByCreators: true,
    usageCount: 215
  },
  {
    id: "18",
    title: "Summer Beach Party",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "eletronica"
  },
  {
    id: "19",
    title: "Wine Tasting Event",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia",
    eventType: "outros"
  },
  {
    id: "20",
    title: "Comedy Night Special",
    imageUrl: "https://images.unsplash.com/photo-1520952924890-3b25cc6d1801?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Entretenimento",
    eventType: "outros"
  },
  {
    id: "21",
    title: "Photography Workshop",
    imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Educativo",
    eventType: "outros"
  },
  {
    id: "22",
    title: "Jazz Night",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Música",
    eventType: "outros"
  },
  {
    id: "23",
    title: "Fashion Week",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Moda",
    eventType: "outros"
  },
  {
    id: "24",
    title: "Street Food Fair",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia",
    eventType: "outros"
  }
];

export const pagodeTemplates: Template[] = [
  {
    id: "25",
    title: "Roda de Pagode",
    imageUrl: "https://images.unsplash.com/photo-1528219089976-59c5172ebdce?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Música",
    eventType: "pagode",
    isPremium: true
  },
  {
    id: "26",
    title: "Festival de Pagode",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival",
    eventType: "pagode"
  },
  {
    id: "27",
    title: "Samba na Praça",
    imageUrl: "https://images.unsplash.com/photo-1473691955023-da1c49c95c78?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "pagode",
    usedByCreators: true,
    usageCount: 178
  },
  {
    id: "28",
    title: "Noite de Pagode",
    imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "pagode"
  }
];

export const sertanejoTemplates: Template[] = [
  {
    id: "29",
    title: "Festa Sertaneja",
    imageUrl: "https://images.unsplash.com/photo-1543083681-3efd3dd4aaa6?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "sertanejo",
    weeklyPopular: true
  },
  {
    id: "30",
    title: "Festival Country",
    imageUrl: "https://images.unsplash.com/photo-1543949806-2c9935b6d213?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival",
    eventType: "sertanejo"
  },
  {
    id: "31",
    title: "Rodeio Oficial",
    imageUrl: "https://images.unsplash.com/photo-1522093537031-3ee69e6b1746?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival",
    eventType: "sertanejo",
    isNew: true
  },
  {
    id: "32",
    title: "Churrasco Sertanejo",
    imageUrl: "https://images.unsplash.com/photo-1513618364580-cbf9c567ed43?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "sertanejo",
    usedByCreators: true,
    usageCount: 134
  }
];

export const funkTemplates: Template[] = [
  {
    id: "33",
    title: "Baile Funk Especial",
    imageUrl: "https://images.unsplash.com/photo-1526979118433-9b67482b05f9?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "baile-funk",
    weeklyPopular: true
  },
  {
    id: "34",
    title: "Noite do Funk",
    imageUrl: "https://images.unsplash.com/photo-1510797188211-3c917b660358?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "baile-funk"
  },
  {
    id: "35",
    title: "Funk na Praia",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "baile-funk",
    isNew: true
  },
  {
    id: "36",
    title: "Montagem Especial",
    imageUrl: "https://images.unsplash.com/photo-1567942712661-82b9b407babd?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa",
    eventType: "baile-funk",
    usedByCreators: true,
    usageCount: 198
  }
];

export const birthdayTemplates: Template[] = [
  {
    id: "37",
    title: "Festa de Aniversário",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Aniversário",
    eventType: "aniversario",
    usedByCreators: true,
    usageCount: 245
  },
  {
    id: "38",
    title: "Aniversário Infantil",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Aniversário",
    eventType: "aniversario"
  },
  {
    id: "39",
    title: "Aniversário Temático",
    imageUrl: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Aniversário",
    eventType: "aniversario",
    isNew: true
  },
  {
    id: "40",
    title: "Festa Surpresa",
    imageUrl: "https://images.unsplash.com/photo-1603566541830-78d707211245?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Aniversário",
    eventType: "aniversario",
    weeklyPopular: true
  }
];

// Group weekly popular templates
export const weeklyPopularTemplates = [
  ...featuredTemplates,
  ...newTemplates,
  ...popularTemplates,
  ...pagodeTemplates,
  ...sertanejoTemplates,
  ...funkTemplates,
  ...birthdayTemplates
].filter(template => template.weeklyPopular);

// Group templates used by creators
export const usedByCreatorsTemplates = [
  ...featuredTemplates,
  ...newTemplates,
  ...popularTemplates,
  ...pagodeTemplates,
  ...sertanejoTemplates,
  ...funkTemplates,
  ...birthdayTemplates
].filter(template => template.usedByCreators);

// Recommendation algorithm helper (simple version)
export const getRecommendedTemplates = (favoriteIds: string[]): Template[] => {
  if (favoriteIds.length === 0) {
    return featuredTemplates.slice(0, 4); // Default recommendations
  }
  
  // Get all templates in one array
  const allTemplates = [
    ...featuredTemplates,
    ...newTemplates,
    ...popularTemplates,
    ...pagodeTemplates,
    ...sertanejoTemplates,
    ...funkTemplates,
    ...birthdayTemplates
  ];
  
  // Get favorite templates
  const favorites = allTemplates.filter(t => favoriteIds.includes(t.id));
  
  // Extract categories and event types from favorites
  const favoriteCategories = [...new Set(favorites.map(t => t.category))];
  const favoriteEventTypes = [...new Set(favorites.map(t => t.eventType).filter(Boolean))];
  
  // Find similar templates that are not already in favorites
  const recommendedTemplates = allTemplates.filter(t => 
    !favoriteIds.includes(t.id) && 
    (favoriteCategories.includes(t.category) || 
     (t.eventType && favoriteEventTypes.includes(t.eventType)))
  );
  
  // Return up to 8 recommendations
  return recommendedTemplates.slice(0, 8);
};
