import { useLingui } from '@lingui/react/macro'

import { Header } from '../components/Header'
import { ExternalImage } from '../components/UI/Image'
import { useQueryApi } from '../hooks/useApi'

import s from './duel.module.css'

type Card = {
  id: string
  name: string
  type: string
  desc: string
  race: string
  card_images: {
    image_url: string
  }[]
  card_prices: {
    cardmarket_price: string
  }[]
}
export default function Duel() {
  const { t } = useLingui()

  const { data, error, status } = useQueryApi<{ data: Card[] }>({
    key: 'duel-cards',
    url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Blue-Eyes',
    error: {
      logName: 'FetchDuelCards',
      messages: {
        default: t`Could not load duel cards.`,
        '500': t`A server error occurred while loading duel cards.`,
      },
    },
  })

  if (status === 'pending') return <div>{t`It's time to duel!`}</div>

  if (error) return <div>{error.firstErrorMessage}</div>

  return (
    <>
      <Header />
      <div className={s.container}>
        {data?.data?.map((card) => (
          <div className={s.card} key={card.id}>
            <h1>{card.name}</h1>
            <div className={s.image}>
              <ExternalImage alt={card.name} src={card.card_images[0].image_url} width={200} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
