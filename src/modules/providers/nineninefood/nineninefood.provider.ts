import type {
  IDeliveryProvider,
  GeoLocation,
  ProviderSearchResult,
  ProviderRestaurantDetail,
} from '../types'

// ─── Mock dataset ─────────────────────────────────────────────────────────────
// Mesmos restaurantes mas com preços/tempos diferentes — demonstra o comparador.
// Estrutura pronta para integração com a API oficial do 99Food.

const RESTAURANT_DB: Record<string, ProviderRestaurantDetail> = {
  'mcdonalds-sp-01': {
    externalId: 'mcdonalds-sp-01',
    name: "McDonald's",
    imageUrl: 'https://placehold.co/400x200/DA020E/white?text=McDonalds',
    category: 'Fast Food',
    rating: 4.5,
    reviewCount: 2341,
    distance: 1.2,
    deliveryFee: 3.99,  // mais caro que iFood
    minDeliveryTime: 20, // mas mais rápido
    maxDeliveryTime: 30,
    minPrice: 18.90,
    hasPromotion: false,
    address: 'Av. Paulista, 1374 - Bela Vista, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'mc-bigmac', name: 'Big Mac', description: 'Dois hambúrgueres, alface, queijo, molho especial, cebola e picles', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=BigMac', price: 27.90, hasPromotion: false },
      { externalId: 'mc-combo-bigmac', name: 'Combo Big Mac', description: 'Big Mac + Batata Grande + Refri Grande', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=Combo', price: 38.90, hasPromotion: false },
      { externalId: 'mc-quarter', name: 'McChicken', description: 'Frango crocante com maionese e alface', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=McChicken', price: 18.90, originalPrice: 22.90, hasPromotion: true, promotionLabel: 'Exclusivo 99Food' },
    ],
  },
  'burgerking-sp-01': {
    externalId: 'burgerking-sp-01',
    name: 'Burger King',
    imageUrl: 'https://placehold.co/400x200/F8AE00/white?text=BurgerKing',
    category: 'Fast Food',
    rating: 4.3,
    reviewCount: 1876,
    distance: 2.1,
    deliveryFee: 1.99,
    minDeliveryTime: 35,
    maxDeliveryTime: 45,
    minPrice: 22.90,
    hasPromotion: true,
    promotionLabel: 'Whopper por R$ 22,90',
    address: 'Rua Augusta, 900 - Consolação, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'bk-whopper', name: 'Whopper', description: 'Hambúrguer grelhado com tomate, alface, maionese, ketchup, cebola e picles', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=Whopper', price: 22.90, originalPrice: 29.90, hasPromotion: true, promotionLabel: 'Promoção do dia' },
      { externalId: 'bk-whopper-duplo', name: 'Whopper Duplo', description: 'Dois hambúrgueres grelhados com todos os acompanhamentos', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=WhoopDuplo', price: 38.90, hasPromotion: false },
      { externalId: 'bk-chicken', name: 'Frango Crispy', description: 'Frango crocante empanado', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=Crispy', price: 23.90, hasPromotion: false },
    ],
  },
  'dominos-sp-01': {
    externalId: 'dominos-sp-01',
    name: "Domino's",
    imageUrl: 'https://placehold.co/400x200/006DB7/white?text=Dominos',
    category: 'Pizza',
    rating: 4.2,
    reviewCount: 1987,
    distance: 1.5,
    deliveryFee: 0,
    minDeliveryTime: 30,
    maxDeliveryTime: 45,
    minPrice: 44.90,
    hasPromotion: true,
    promotionLabel: 'Entrega grátis + 2ª pizza 40% off',
    address: 'Av. Brigadeiro Faria Lima, 1811 - Jardim Paulistano',
    isOpen: true,
    menu: [
      { externalId: 'dom-pepperoni', name: 'Pizza Pepperoni M', description: 'Molho pomodoro, mussarela e pepperoni', imageUrl: 'https://placehold.co/200x200/006DB7/white?text=Pepperoni', price: 44.90, hasPromotion: false },
      { externalId: 'dom-extrhalfway', name: 'Extravaganzza G', description: 'Pepperoni, carne, cogumelos, azeitonas, pimentão e cebola', imageUrl: 'https://placehold.co/200x200/006DB7/white?text=Extravaganza', price: 72.90, originalPrice: 89.90, hasPromotion: true, promotionLabel: '40% off na 2ª' },
      { externalId: 'dom-frango-catupiry', name: 'Frango c/ Catupiry G', description: 'Frango desfiado com catupiry original', imageUrl: 'https://placehold.co/200x200/006DB7/white?text=FrCatupiry', price: 64.90, hasPromotion: false },
    ],
  },
  'outback-sp-01': {
    externalId: 'outback-sp-01',
    name: 'Outback Steakhouse',
    imageUrl: 'https://placehold.co/400x200/8B0000/white?text=Outback',
    category: 'Carnes',
    rating: 4.7,
    reviewCount: 892,
    distance: 3.4,
    deliveryFee: 7.99,  // mais barato que iFood
    minDeliveryTime: 50,
    maxDeliveryTime: 65,
    minPrice: 62.90,
    hasPromotion: true,
    promotionLabel: 'Frete R$ 7,99',
    address: 'Shopping Ibirapuera - Av. Ibirapuera, 3103',
    isOpen: true,
    menu: [
      { externalId: 'ob-alice-springs', name: 'Alice Springs Chicken', description: 'Frango grelhado com cogumelos, bacon e queijo', imageUrl: 'https://placehold.co/200x200/8B0000/white?text=Alice', price: 85.90, originalPrice: 87.90, hasPromotion: true, promotionLabel: 'Exclusivo 99Food' },
      { externalId: 'ob-ribs', name: 'Baby Back Ribs', description: 'Costela suína com molho especial defumado', imageUrl: 'https://placehold.co/200x200/8B0000/white?text=Ribs', price: 117.90, hasPromotion: false },
      { externalId: 'ob-bloomin', name: "Bloomin' Onion", description: 'Cebola gigante empanada frita com molho especial', imageUrl: 'https://placehold.co/200x200/8B0000/white?text=Onion', price: 62.90, hasPromotion: false },
    ],
  },
  'japansushi-sp-01': {
    externalId: 'japansushi-sp-01',
    name: 'Japan Sushi',
    imageUrl: 'https://placehold.co/400x200/1a1a2e/white?text=JapanSushi',
    category: 'Japonesa',
    rating: 4.8,
    reviewCount: 654,
    distance: 1.7,
    deliveryFee: 5.99,  // pago aqui vs grátis no iFood
    minDeliveryTime: 35,
    maxDeliveryTime: 50,
    minPrice: 52.00,
    hasPromotion: true,
    promotionLabel: 'Combo com sobremesa',
    address: 'Rua Liberdade, 234 - Liberdade, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'js-combo20', name: 'Combinado 20 Peças', description: 'Mix de sashimi, nigiri e hot rolls', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Combo20', price: 52.00, hasPromotion: false },
      { externalId: 'js-combo40', name: 'Combinado 40 Peças + Sobremesa', description: 'Mix especial com temaki, uramaki e sorvete mochi', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Combo40', price: 95.00, originalPrice: 115.00, hasPromotion: true, promotionLabel: 'Sobremesa inclusa' },
      { externalId: 'js-temaki', name: 'Temaki Salmão', description: 'Cone de alga com arroz e salmão fresco', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Temaki', price: 27.90, hasPromotion: false },
    ],
  },
  'spoleto-sp-01': {
    externalId: 'spoleto-sp-01',
    name: 'Spoleto',
    imageUrl: 'https://placehold.co/400x200/006240/white?text=Spoleto',
    category: 'Italiana',
    rating: 4.0,
    reviewCount: 789,
    distance: 1.1,
    deliveryFee: 0,
    minDeliveryTime: 25,
    maxDeliveryTime: 40,
    minPrice: 29.90,
    hasPromotion: true,
    promotionLabel: 'Entrega grátis',
    address: 'Rua Oscar Freire, 540 - Jardins, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'sp-carbonara', name: 'Fusilli Carbonara', description: 'Massa fusilli com bacon, ovo e queijo parmesão', imageUrl: 'https://placehold.co/200x200/006240/white?text=Carbonara', price: 39.90, hasPromotion: false },
      { externalId: 'sp-bolognese', name: 'Penne Bolognese', description: 'Penne ao molho de carne bovina com ervas', imageUrl: 'https://placehold.co/200x200/006240/white?text=Bolognese', price: 38.90, hasPromotion: false },
      { externalId: 'sp-vegetariano', name: 'Rigatoni Vegetariano', description: 'Massa com legumes grelhados e azeite de oliva', imageUrl: 'https://placehold.co/200x200/006240/white?text=Veggie', price: 29.90, originalPrice: 34.90, hasPromotion: true, promotionLabel: 'Combo refri' },
    ],
  },
  'subway-sp-01': {
    externalId: 'subway-sp-01',
    name: 'Subway',
    imageUrl: 'https://placehold.co/400x200/007B40/white?text=Subway',
    category: 'Sanduíches',
    rating: 4.1,
    reviewCount: 1234,
    distance: 0.6,
    deliveryFee: 0,     // grátis aqui vs R$ 3,99 no iFood
    minDeliveryTime: 25,
    maxDeliveryTime: 35,
    minPrice: 19.90,    // mais barato
    hasPromotion: true,
    promotionLabel: 'Entrega grátis',
    address: 'Av. Rebouças, 1045 - Pinheiros, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'sub-frango', name: 'Frango Teriaki 30cm', description: 'Frango grelhado com molho teriaki e vegetais', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Frango', price: 27.90, hasPromotion: false },
      { externalId: 'sub-italiana', name: 'Italiana 30cm', description: 'Salaminho, presunto, peperoni e queijo', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Italiana', price: 33.90, hasPromotion: false },
      { externalId: 'sub-atum', name: 'Atum 15cm', description: 'Atum com maionese e vegetais frescos', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Atum', price: 19.90, hasPromotion: false },
    ],
  },
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'mcdonalds-sp-01':  ['hamburguer', 'burger', 'mcdonalds', 'fast food', 'frango', 'mc'],
  'burgerking-sp-01': ['hamburguer', 'burger', 'king', 'whopper', 'fast food', 'frango'],
  'dominos-sp-01':    ['pizza', 'pizzaria', 'italiana'],
  'outback-sp-01':    ['carne', 'churrasco', 'steak', 'americano', 'costela'],
  'japansushi-sp-01': ['sushi', 'japones', 'japao', 'oriental', 'temaki', 'sashimi'],
  'spoleto-sp-01':    ['massa', 'italiana', 'macarrao', 'pasta'],
  'subway-sp-01':     ['sanduiche', 'subway', 'lanche', 'salada'],
}

function matchesQuery(query: string, restaurantId: string): boolean {
  const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const keywords = CATEGORY_KEYWORDS[restaurantId] ?? []
  const name = (RESTAURANT_DB[restaurantId]?.name ?? '').toLowerCase()
  return keywords.some((k) => q.includes(k) || k.includes(q)) || name.includes(q)
}

export class NineNineFoodProvider implements IDeliveryProvider {
  readonly slug = '99food'
  readonly displayName = '99Food'
  readonly color = '#FFD100'
  readonly textColor = '#1a1a1a'

  async search(query: string, _location?: GeoLocation): Promise<ProviderSearchResult[]> {
    const allIds = Object.keys(RESTAURANT_DB)
    const matched = allIds.filter((id) => matchesQuery(query, id))
    const ids = matched.length > 0 ? matched : allIds

    return ids.map((id) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address, isOpen, menu, ...result } = RESTAURANT_DB[id] as ProviderRestaurantDetail
      return result
    })
  }

  async getRestaurantDetail(externalId: string, _location?: GeoLocation): Promise<ProviderRestaurantDetail | null> {
    return RESTAURANT_DB[externalId] ?? null
  }

  buildRedirectUrl(restaurantExternalId: string, _itemExternalId?: string): string {
    // Estrutura real aguarda parceria oficial com 99Food
    return `https://99app.com/food/restaurante/${encodeURIComponent(restaurantExternalId)}`
  }
}
