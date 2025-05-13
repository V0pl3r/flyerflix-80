export type Template = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  canvaUrl?: string;
  isPremium?: boolean;
};

export const featuredTemplates: Template[] = [
  {
    id: "1",
    title: "Neon Party Flyer",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa"
  },
  {
    id: "2",
    title: "Summer Festival",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival"
  },
  {
    id: "3",
    title: "DJ Night Special",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Clubbing"
  },
  {
    id: "4",
    title: "Art Exhibit Opening",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Exposição"
  },
  {
    id: "5",
    title: "Rock Concert Live",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Show"
  },
  {
    id: "6",
    title: "Corporate Gala",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Corporativo"
  },
  {
    id: "7",
    title: "Wedding Invitation",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Casamento"
  },
  {
    id: "8",
    title: "Food Festival",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia"
  }
];

export const newTemplates: Template[] = [
  {
    id: "9",
    title: "Spring Fashion Show",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Moda"
  },
  {
    id: "10",
    title: "Tech Conference",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Tecnologia"
  },
  {
    id: "11",
    title: "New Year Party",
    imageUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa"
  },
  {
    id: "12",
    title: "Yoga Retreat",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Bem-Estar"
  },
  {
    id: "13",
    title: "Charity Fundraiser",
    imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Beneficente"
  },
  {
    id: "14",
    title: "Halloween Special",
    imageUrl: "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Temático"
  },
  {
    id: "15",
    title: "Book Launch Event",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Literatura"
  },
  {
    id: "16",
    title: "Fitness Challenge",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Esporte"
  }
];

export const popularTemplates: Template[] = [
  {
    id: "17",
    title: "House Music Festival",
    imageUrl: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festival"
  },
  {
    id: "18",
    title: "Summer Beach Party",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Festa"
  },
  {
    id: "19",
    title: "Wine Tasting Event",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia"
  },
  {
    id: "20",
    title: "Comedy Night Special",
    imageUrl: "https://images.unsplash.com/photo-1520952924890-3b25cc6d1801?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Entretenimento"
  },
  {
    id: "21",
    title: "Photography Workshop",
    imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Educativo"
  },
  {
    id: "22",
    title: "Jazz Night",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Música"
  },
  {
    id: "23",
    title: "Fashion Week",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Moda"
  },
  {
    id: "24",
    title: "Street Food Fair",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400&h=700",
    category: "Gastronomia"
  }
];
