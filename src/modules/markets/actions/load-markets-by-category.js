import { augur } from 'services/augurjs'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-category'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

export const loadMarketsByCategory = category => (dispatch, getState) => {
  const { env, universe } = getState()

  const params = { category, universe: universe.id }

  if (env['bug-bounty']) {
    params.creator = env['bug-bounty-address']
  }

  augur.markets.getMarkets(params, (err, marketIds) => {
    if (err) {
      console.error('ERROR findMarketsWithCategory()', err)
      dispatch(updateHasLoadedCategory({ [category]: false }))
    } else if (!marketIds) {
      console.warn('WARN findMarketsWithCategory()', `no market id's returned`)
      dispatch(updateHasLoadedCategory({ [category]: false }))
    } else if (marketIds.length) {
      dispatch(updateHasLoadedCategory({ [category]: true }))
      dispatch(clearMarketsFilteredSorted())
      dispatch(updateMarketsFilteredSorted(marketIds))
      dispatch(loadMarketsInfo(marketIds))
    }
  })
}
