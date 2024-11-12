export const routerReplaceURL = (new_url: string) => {
  if (!!window) {
    window.history.replaceState({ ...window.history.state, as: new_url, url: new_url }, '', new_url)
  }
}