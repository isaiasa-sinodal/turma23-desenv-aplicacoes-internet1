const DEFAULT_DELAY = 0 // 2 * 1000

export const delay = (value = DEFAULT_DELAY) => {
  if (!value) return
  return new Promise<void>((res) => setTimeout(() => res(), value))
}
