/**
 * The site keeps admin content in the browser (localStorage), but the server
 * can't see it. If the first browser render used saved data, it wouldn't match
 * the server's HTML and React throws "Text content does not match
 * server-rendered HTML". So storage reads return the defaults until the page
 * has hydrated; then <StorageReady /> flips this flag and refreshes all data.
 */
let hydrated = false;

export function canReadStorage(): boolean {
  return typeof window !== "undefined" && hydrated;
}

export function markHydrated() {
  hydrated = true;
}
