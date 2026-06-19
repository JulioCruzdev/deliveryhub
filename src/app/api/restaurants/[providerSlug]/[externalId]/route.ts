import { NextRequest } from 'next/server'
import { getProviderBySlug } from '@/modules/providers/registry'
import { ok, notFound, handleError } from '@/lib/api-response'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ providerSlug: string; externalId: string }> }
) {
  try {
    const { providerSlug, externalId } = await params
    const provider = getProviderBySlug(providerSlug)
    if (!provider) return notFound('Plataforma não encontrada')

    const restaurant = await provider.getRestaurantDetail(externalId)
    if (!restaurant) return notFound('Restaurante não encontrado')

    const redirectUrl = provider.buildRedirectUrl(externalId)

    return ok({
      restaurant: {
        ...restaurant,
        providerSlug: provider.slug,
        providerName: provider.displayName,
        providerColor: provider.color,
        providerTextColor: provider.textColor,
        redirectUrl,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
