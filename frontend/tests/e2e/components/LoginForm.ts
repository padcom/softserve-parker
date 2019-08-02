import Component from './Component'

export default class LoginForm extends Component {
  get username () {
    return this.root.find('[name="username"]')
  }

  get password () {
    return this.root.find('[name="password"]')
  }

  get submit () {
    return this.root.find('[name="login"]')
  }

  login (username: string, password: string) {
    this.username.clear().type(username)
    this.password.clear().type(password)
    this.submit.click()
  }
}
