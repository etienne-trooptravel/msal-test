<template>
  <div id="app">
    <div id="nav">
      <img src="./assets/logo.png">
      <h1>{{ msg }}</h1>
      <button @click="login" type="button" v-if="!user">Login with Microsoft</button>
      <button @click="callAPI" type="button" v-if="user">
        Call Graph's /me API
      </button>
      <button @click="logout" type="button" v-if="user">
        Logout
      </button>
      <h3 v-if="user">Hello {{ user.name }}</h3>
      <pre v-if="userInfo">{{ JSON.stringify(userInfo, null, 4) }}</pre>
      <p v-if="loginFailed">Login unsuccessful</p>
      <p v-if="apiCallFailed">Graph API call unsuccessful</p>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <!-- <router-view/> -->
  </div>
</template>

<script>
import AuthService from '@/msal'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to your Vue.js App',
      user: null,
      userInfo: null,
      apiCallFailed: false,
      loginFailed: false
    }
  },
  created () {
    this.authService = new AuthService()
  },
  methods: {
    callAPI () {
      this.apiCallFailed = false
      this.authService.getGraphToken().then(
        token => {
          this.authService.getGraphUserInfo(token).then(
            data => {
              this.userInfo = data
            },
            error => {
              console.error(error)
              this.apiCallFailed = true
            }
          )
        },
        error => {
          console.error(error)
          this.apiCallFailed = true
        }
      )
    },
    logout () {
      this.authService.logout()
    },
    login () {
      this.loginFailed = false
      this.authService.loginPopup().then(
        user => {
          if (user) {
            this.user = user
          } else {
            this.loginFailed = true
          }
        },
        () => {
          this.loginFailed = true
        }
      )
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  margin: 15px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
