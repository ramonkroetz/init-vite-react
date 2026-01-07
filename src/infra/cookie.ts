import Cookies from 'js-cookie'

function get(cookieId: string) {
  return Cookies.get(cookieId)
}

function remove(cookieId: string) {
  Cookies.remove(cookieId)
}

function set(cookieId: string, value: string) {
  Cookies.set(cookieId, value, {
    secure: window.location.protocol.startsWith('https'),
    sameSite: 'lax',
  })
}

const CookieService = {
  get,
  remove,
  set,
}

export default CookieService
