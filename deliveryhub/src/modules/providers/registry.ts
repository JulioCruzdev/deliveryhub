import { IfoodProvider } from './ifood/ifood.provider'
import { NineNineFoodProvider } from './nineninefood/nineninefood.provider'
import type { IDeliveryProvider } from './types'

const providers: IDeliveryProvider[] = [
  new IfoodProvider(),
  new NineNineFoodProvider(),
]

export function getAllProviders(): IDeliveryProvider[] {
  return providers
}

export function getProviderBySlug(slug: string): IDeliveryProvider | undefined {
  return providers.find((p) => p.slug === slug)
}
