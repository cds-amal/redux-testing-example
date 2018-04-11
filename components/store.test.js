/* eslint-env mocha,chai */
import {expect} from 'chai'
import {gotPugs, fetchPugs, reducer} from './store'
import {createStore, applyMiddleware} from 'redux'
import thunks from 'redux-thunk'

const pugs = [{id: 1, name: 'Cody'}]

const testStore = createStore(
  reducer,
  applyMiddleware(
    thunks
      .withExtraArgument({
        axios: {
          async get () {
            return {data: pugs}
          }
        }
      })
  )
)

describe('store', () => {
  describe('action creators', () => {
    it('gotPugs', () => {
      const action = gotPugs(pugs)
      expect(action.pugs).to.deep.equal(pugs)
      expect(action.type).to.equal('GOT_PUGS')
    })
  })

  describe('reducer', () => {
    it('GOT_PUGS', () => {
      const prevState = {pugs: [], error: {}}
      const nextState = reducer(prevState, {type: 'GOT_PUGS', pugs})

      expect(nextState.pugs).to.deep.equal(pugs)
      expect(nextState.error).to.deep.equal(prevState.error)
    })
  })

  describe('thunk creator', () => {
    it('fetchPugs', async () => {
      // tests reducer as well as state
      // better to make assertions about the actions the reducer receives
      // rather than the next state object
      await testStore.dispatch(fetchPugs())
      // //what we should do:

      // const [gotPugsAction] = testStore.getActions()
      // expect(gotPugsAction).to.deep.equal({type: 'GOT_PUGS', pugs})

      // //what we were doing:
      // const state = testStore.getState()
      // expect(state.pugs).to.deep.equal(pugs)
    })
  })
})
