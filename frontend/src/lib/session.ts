const TOKEN_KEY = 'financy:token'

export const session = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string, remember: boolean) {
    this.clear()
    ;(remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}
