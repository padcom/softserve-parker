import Component from './Component'

export default class LoginForm extends Component {
  get email () {
    return this.root.find('[name="email"]')
  }

  get password () {
    return this.root.find('[name="password"]')
  }

  get submit () {
    return this.root.find('[name="login"]')
  }

  login (email: string, password: string) {
    this.email.clear().type(email)
    this.password.clear().type(password)
    this.submit.click()
  }
}
