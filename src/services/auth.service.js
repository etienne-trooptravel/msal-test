import * as Msal from 'msal'

export default class AuthService {
  constructor () {
    const PROD_REDIRECT_URI = 'http://localhost:8081/callback'
    let redirectUri = window.location.origin
    if (window.location.hostname !== '127.0.0.1') {
      redirectUri = PROD_REDIRECT_URI
    }
    this.applicationConfig = {
      clientID: '956ee261-b0f8-4964-8140-677bb6d1c58d',
      graphScopes: ['user.read']
    }
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      '',
      () => {
        // callback for login redirect
      },
      {
        redirectUri
      }
    )
  }

  login () {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser()
        if (user) {
          return user
        } else {
          return null
        }
      },
      () => {
        return null
      }
    )
  };

  logout () {
    this.app.logout()
  };

  getToken () {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken
      },
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken
            },
            err => {
              console.error(err)
            }
          )
      }
    )
  };
}
