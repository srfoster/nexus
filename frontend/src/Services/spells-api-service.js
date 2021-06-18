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
  getPublicSpellById(id){
    return fetch(`${config.API_ENDPOINT}/public-spells/${id}`, {
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
          // TODO: Check error message and act accordingly
          // This is used if user logs out, then immediately hits back to return to /spells
          // Error message needs to be looked at.
          if (history) history.push('/gallery')
          // return Promise.reject(e)
        })
        : res.json()
    )
  },
  getUserById(id, page, search){
    page = page || 1
    let searchPath = search ? `&search=${search}` : ""
    return fetch(`${config.API_ENDPOINT}/mages/${id}?page=${page}${searchPath}`, {
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
  postNewSpell(title){
    return fetch(`${config.API_ENDPOINT}/spells?title=${title}`, {
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
  deleteSpells(id){
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
  checkForSpellOwnership(spell_id){
    return fetch(`${config.API_ENDPOINT}/check-ownership/${spell_id}`, {
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
  getDownloads(){
    return fetch(`${config.API_ENDPOINT}/downloads`, {
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

  // change this to accept current page and need to do some backend stuff to accept current page and limit the payload
  getFollows(id , page){
    page = page || 1
    return fetch(`${config.API_ENDPOINT}/users/${id}/follows?page=${page}`, {
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
  postFollows(id, follow_id){
    return fetch(`${config.API_ENDPOINT}/users/${id}/follows?following=${follow_id}`, {
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
  deleteFollows(id, follow_id){
    return fetch(`${config.API_ENDPOINT}/users/${id}/follows?following=${follow_id}`, {
      method: 'DELETE',
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
  addBadgeToUser(name){
    return fetch(`${config.API_ENDPOINT}/users/me/badges/${name}`, {
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
  deleteBadgeFromUser(userId,name){
    return fetch(`${config.API_ENDPOINT}/users/${userId}/badges/${name}`, {
      method: 'DELETE',
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
  getBadgesByUser(id){
    return fetch(`${config.API_ENDPOINT}/users/${id}/badges`, {
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
}

export default SpellsApiService
