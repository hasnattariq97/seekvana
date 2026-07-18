import { SearchModal } from './search-modal'
import { getSearchIndex } from '@/lib/search-index'

export function SearchModalServer() {
  return <SearchModal data={getSearchIndex()} />
}
