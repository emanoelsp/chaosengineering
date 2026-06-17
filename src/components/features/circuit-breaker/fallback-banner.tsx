interface FallbackBannerProps {
  visible: boolean
}

export function FallbackBanner({ visible }: FallbackBannerProps) {
  if (!visible) return null

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
      <strong>Frete calculado pelo plano B:</strong> A API de IA está temporariamente indisponível.
      Aplicando frete fixo de R$ 10,00. Você ainda pode finalizar a compra normalmente.
    </div>
  )
}
