import { getLogin, logout } from 'helpers';

// TODO: CHANGE THIS
const api = route => `https://api.unioil.thenerds.solutions${route}`;

class APIService
{
  async login(identifier, password)
  {
    return fetch(api('/auth/local'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, password })
    }).then(jsonify)
      .then(response => {

        console.log('login response', response);

        const { jwt, user } = response;

        if (jwt) {
          localStorage.setItem('bG9naW4=', jwt);
        }
        if (user) {
          localStorage.setItem('userId',user.id);
        }
       
        return response;
    }).catch(() => {
      return ({ success: false });
    });
  }

  request(route, method, options = {})
  {
    const login = getLogin();
    if(!login)
      return logout();

    return fetch(api(route),
    {
      method,
      headers:
      {
        Authorization: `Bearer ${login}`,
        ...(options.body? { 'Content-Type': 'application/json' }: {})
      },
      ...options
    })
      .then(response =>
      {
        if(response.status === 401)
          return logout();

        return jsonify(response);
      })
      .catch(error =>
      {
        console.error(error);
        return ({ success: false });
      });
  }

  batchrequest(route, method, data)
  {
    const login = getLogin();

    if (!login) { return logout(); }

    console.log('login', login);

    console.log('options', data);
    fetch(api(route),
    {
      method,
      headers:
      {
        'Authorization': `Bearer ${login}`,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(data)
    })
    .then(jsonify)
    .then((response) =>
    {
        console.log('promise fulfilled');
        console.log('api response', response);

        return response;
        //if(response.status === 401)
          //return logout();

        //return response.data.json();
      })
      .catch(error =>
      {
        console.error(error);
        return ({ success: false });
      });
  }


  customRequest(route, method, options = {})
  {
    const login = getLogin();
    if(!login)
      return logout();

    return fetch(api(route),
    {
      method,
      headers:
      {
        Authorization: `Bearer ${login}`,
        ...(options.body? { 'Content-Type': 'application/json' }: {})
      },
      ...options
    })
      .then(response =>
      {

        console.log(response);
        setTimeout(() => {
              return response;
            }, 5000)

      })
      .catch(error =>
      {
        console.error(error);
        return ({ success: false });
      });
  }

  customget(route)
  {
    return this.customRequest(route, 'GET');
  }
  get(route)
  {
    return this.request(route, 'GET');
  }

  post(route, data)
  {
    return this.request(route, 'POST', { body: bodify(data) });
  }

  patch(route, data)
  {
    return this.request(route, 'PATCH', { body: bodify(data) });
  }

  put(route, data)
  {
    return this.request(route, 'PUT', { body: bodify(data) });
  }

  delete(route, id)
  {
    return this.request(`${route}/${id}`, 'DELETE');
  }
}

function jsonify(response)
{
  return response.json();
}

function bodify(data)
{
  for(const key in data)
  {
    if(data[key] === '' || data[key] === undefined)
      delete data[key];
  }

  return JSON.stringify(data);
}

export const apiService = new APIService();
