export default function ucwords(words: string) {
  return words
    .split(' ')
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ')
}