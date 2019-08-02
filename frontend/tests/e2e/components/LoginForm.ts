import Component from './Component'

export default class LoginForm extends Component {
  login (username: string, password: string) {
    this.root.find('[name="username"]').clear().type(username)
    this.root.find('[name="password"]').clear().type(password)
    this.root.find('[name="login"]').click()
  }
}
