import config from '../config'
import TokenService from './token-service'
// import IdleService from './idle-service'

const SpellsApiService = {
  getPublicSpells(page, search){
    return fetch(`${config.API_ENDPOINT}/gallery?page=${page}&search=${search}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  getSpellById(id){
    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },

    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  getSpellsByUser(history, page, search, sortDirection, sort){
    return fetch(`${config.API_ENDPOINT}/spells?page=${page}&search=${search}&sort=${sort}&sortDirection=${sortDirection}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
    .then(res =>
      (!res.ok)
        ? res.json().then(e => {
          // console.log("Are we there yet?");
          // TODO: Check error message and act accordingly
          if (history) history.push('/gallery')
          // return Promise.reject(e)
        })
        : res.json()
    )
  },
  getUserById(id, page, search){
    page = page || 1
    let searchPath = search ? `&search=${search}` : ""
    return fetch(`${config.API_ENDPOINT}/wizards/${id}?page=${page}${searchPath}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },

    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  postNewSpell(){
    return fetch(`${config.API_ENDPOINT}/spells`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  forkSpellById(id){
    return fetch(`${config.API_ENDPOINT}/spells/${id}/fork`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  deleteSpell(id){
    id = typeof(id) === 'number' ? id : id.join(',')
    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      // body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  updateSpell(payload, id){
    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
}

export default SpellsApiService
