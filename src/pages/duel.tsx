import { Image } from '../components/UI/Image'
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
  const { data, error, status } = useQueryApi<{ data: Card[] }>({
    key: 'todo',
    url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Blue-Eyes',
    error: {
      logName: 'Duel',
      messages: {
        default: 'Something went wrong with the duel',
      },
    },
  })

  if (status === 'pending') return <div>Its time to duel!</div>

  if (error) return <div>{error.firstErrorMessage}</div>

  return (
    <div className={s.container}>
      {data?.data?.map((card) => (
        <div className={s.card} key={card.id}>
          <h1>{card.name}</h1>
          <div className={s.image}>
            <Image alt={card.name} src={card.card_images[0].image_url} width={200} />
          </div>
        </div>
      ))}
    </div>
  )
}
