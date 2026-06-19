import type {
  IDeliveryProvider,
  GeoLocation,
  ProviderSearchResult,
  ProviderRestaurantDetail,
} from '../types'

// ─── Mock dataset ─────────────────────────────────────────────────────────────
// Estrutura pronta para substituição pela Merchant API oficial iFood.
// Ref: https://developer.ifood.com.br

const RESTAURANT_DB: Record<string, ProviderRestaurantDetail> = {
  'mcdonalds-sp-01': {
    externalId: 'mcdonalds-sp-01',
    name: "McDonald's",
    imageUrl: 'https://placehold.co/400x200/DA020E/white?text=McDonalds',
    category: 'Fast Food',
    rating: 4.5,
    reviewCount: 2341,
    distance: 1.2,
    deliveryFee: 2.99,
    minDeliveryTime: 25,
    maxDeliveryTime: 35,
    minPrice: 18.90,
    hasPromotion: false,
    address: 'Av. Paulista, 1374 - Bela Vista, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'mc-bigmac', name: 'Big Mac', description: 'Dois hambúrgueres, alface, queijo, molho especial, cebola e picles', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=BigMac', price: 28.90, hasPromotion: false },
      { externalId: 'mc-combo-bigmac', name: 'Combo Big Mac', description: 'Big Mac + Batata Grande + Refri Grande', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=Combo', price: 39.90, originalPrice: 44.90, hasPromotion: true, promotionLabel: 'R$ 5,00 de desconto' },
      { externalId: 'mc-quarter', name: 'McChicken', description: 'Frango crocante com maionese e alface', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=McChicken', price: 18.90, hasPromotion: false },
      { externalId: 'mc-batata', name: 'Batata Frita Grande', description: 'Batata frita crocante tamanho grande', imageUrl: 'https://placehold.co/200x200/DA020E/white?text=Batata', price: 12.90, hasPromotion: false },
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
    deliveryFee: 0,
    minDeliveryTime: 30,
    maxDeliveryTime: 40,
    minPrice: 22.90,
    hasPromotion: true,
    promotionLabel: 'Entrega grátis',
    address: 'Rua Augusta, 900 - Consolação, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'bk-whopper', name: 'Whopper', description: 'Hambúrguer grelhado com tomate, alface, maionese, ketchup, cebola e picles', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=Whopper', price: 29.90, hasPromotion: false },
      { externalId: 'bk-whopper-duplo', name: 'Whopper Duplo', description: 'Dois hambúrgueres grelhados com todos os acompanhamentos', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=WhooperDuplo', price: 39.90, originalPrice: 45.90, hasPromotion: true, promotionLabel: 'R$ 6,00 off' },
      { externalId: 'bk-chicken', name: 'Frango Crispy', description: 'Frango crocante empanado', imageUrl: 'https://placehold.co/200x200/F8AE00/333?text=Crispy', price: 22.90, hasPromotion: false },
    ],
  },
  'pizzahut-sp-01': {
    externalId: 'pizzahut-sp-01',
    name: 'Pizza Hut',
    imageUrl: 'https://placehold.co/400x200/C8102E/white?text=PizzaHut',
    category: 'Pizza',
    rating: 4.4,
    reviewCount: 3102,
    distance: 0.9,
    deliveryFee: 4.99,
    minDeliveryTime: 35,
    maxDeliveryTime: 50,
    minPrice: 49.90,
    hasPromotion: true,
    promotionLabel: '2ª pizza 50% off',
    address: 'Av. Faria Lima, 2232 - Jardins, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'ph-pepperoni', name: 'Pizza Pepperoni M', description: 'Molho de tomate, mussarela e pepperoni fatiado', imageUrl: 'https://placehold.co/200x200/C8102E/white?text=Pepperoni', price: 49.90, hasPromotion: false },
      { externalId: 'ph-margherita', name: 'Pizza Margherita G', description: 'Molho de tomate, mussarela e manjericão fresco', imageUrl: 'https://placehold.co/200x200/C8102E/white?text=Margherita', price: 64.90, originalPrice: 79.90, hasPromotion: true, promotionLabel: '2ª pizza 50% off' },
      { externalId: 'ph-frango', name: 'Pizza Frango c/ Catupiry G', description: 'Frango desfiado com catupiry cremoso', imageUrl: 'https://placehold.co/200x200/C8102E/white?text=Frango', price: 69.90, hasPromotion: false },
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
    deliveryFee: 9.99,
    minDeliveryTime: 45,
    maxDeliveryTime: 60,
    minPrice: 62.90,
    hasPromotion: false,
    address: 'Shopping Ibirapuera - Av. Ibirapuera, 3103',
    isOpen: true,
    menu: [
      { externalId: 'ob-alice-springs', name: 'Alice Springs Chicken', description: 'Frango grelhado com cogumelos, bacon e queijo', imageUrl: 'https://placehold.co/200x200/8B0000/white?text=Alice', price: 87.90, hasPromotion: false },
      { externalId: 'ob-ribs', name: 'Baby Back Ribs', description: 'Costela suína com molho especial defumado', imageUrl: 'https://placehold.co/200x200/8B0000/white?text=Ribs', price: 119.90, hasPromotion: false },
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
    deliveryFee: 0,
    minDeliveryTime: 40,
    maxDeliveryTime: 55,
    minPrice: 55.00,
    hasPromotion: true,
    promotionLabel: 'Entrega grátis',
    address: 'Rua Liberdade, 234 - Liberdade, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'js-combo20', name: 'Combinado 20 Peças', description: 'Mix de sashimi, nigiri e hot rolls', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Combo20', price: 55.00, hasPromotion: false },
      { externalId: 'js-combo40', name: 'Combinado 40 Peças', description: 'Mix especial com temaki e uramaki', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Combo40', price: 98.00, originalPrice: 110.00, hasPromotion: true, promotionLabel: 'R$ 12,00 de desconto' },
      { externalId: 'js-temaki', name: 'Temaki Salmão', description: 'Cone de alga com arroz e salmão fresco', imageUrl: 'https://placehold.co/200x200/1a1a2e/white?text=Temaki', price: 28.90, hasPromotion: false },
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
    deliveryFee: 3.99,
    minDeliveryTime: 20,
    maxDeliveryTime: 30,
    minPrice: 21.90,
    hasPromotion: false,
    address: 'Av. Rebouças, 1045 - Pinheiros, São Paulo',
    isOpen: true,
    menu: [
      { externalId: 'sub-frango', name: 'Frango Teriaki 30cm', description: 'Frango grelhado com molho teriaki e vegetais', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Frango', price: 29.90, hasPromotion: false },
      { externalId: 'sub-italiana', name: 'Italiana 30cm', description: 'Salaminho, presunto, peperoni e queijo', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Italiana', price: 34.90, hasPromotion: false },
      { externalId: 'sub-atum', name: 'Atum 15cm', description: 'Atum com maionese e vegetais frescos', imageUrl: 'https://placehold.co/200x200/007B40/white?text=Atum', price: 21.90, originalPrice: 26.90, hasPromotion: true, promotionLabel: 'Combo com refri' },
    ],
  },
}

// Índice para busca por categoria/keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'mcdonalds-sp-01':   ['hamburguer', 'burger', 'mcdonalds', 'fast food', 'frango', 'mc'],
  'burgerking-sp-01':  ['hamburguer', 'burger', 'king', 'whopper', 'fast food', 'frango'],
  'pizzahut-sp-01':    ['pizza', 'pizzaria', 'italiana'],
  'outback-sp-01':     ['carne', 'churrasco', 'steak', 'americano', 'costela'],
  'japansushi-sp-01':  ['sushi', 'japones', 'japao', 'oriental', 'temaki', 'sashimi'],
  'subway-sp-01':      ['sanduiche', 'subway', 'lanche', 'salada'],
}

function matchesQuery(query: string, restaurantId: string): boolean {
  const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const keywords = CATEGORY_KEYWORDS[restaurantId] ?? []
  const name = (RESTAURANT_DB[restaurantId]?.name ?? '').toLowerCase()
  return keywords.some((k) => q.includes(k) || k.includes(q)) || name.includes(q)
}

export class IfoodProvider implements IDeliveryProvider {
  readonly slug = 'ifood'
  readonly displayName = 'iFood'
  readonly color = '#EA1D2C'
  readonly textColor = '#ffffff'

  async search(query: string, _location?: GeoLocation): Promise<ProviderSearchResult[]> {
    const allIds = Object.keys(RESTAURANT_DB)
    const matched = allIds.filter((id) => matchesQuery(query, id))
    const ids = matched.length > 0 ? matched : allIds

    return ids.map((id) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address, isOpen, menu, ...result } = RESTAURANT_DB[id]
      return result
    })
  }

  async getRestaurantDetail(externalId: string, _location?: GeoLocation): Promise<ProviderRestaurantDetail | null> {
    return RESTAURANT_DB[externalId] ?? null
  }

  buildRedirectUrl(restaurantExternalId: string, _itemExternalId?: string): string {
    // Estrutura real: https://www.ifood.com.br/restaurante/{slug}
    // Aguardando parceria oficial para gerar deep links reais
    return `https://www.ifood.com.br/busca?q=${encodeURIComponent(restaurantExternalId)}`
  }
}
