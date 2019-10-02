import httpMocks from 'node-mocks-http'
import { Authenticator } from './authenticate'
import { Session } from '../db/Session'
import { User } from '../db/User'

beforeEach(async () => {
  await new User().create('fake@softserveinc.com', '$2b$10$RKJermYaezNSXeQK.osx8OOgIppGcd7CaVC4dCAcMRnhjrmnXeIG.')
})

afterEach(async () => {
  await new User().delete('fake@softserveinc.com')
})

describe('Authentication', () => {
	test('Responds with 403 code and lack of credentials message when credentials are not provided', async () => {
		const authenticator = new Authenticator()
		const request  = httpMocks.createRequest({
			method: 'POST',
			url: '/login',
		});
		
		const response = httpMocks.createResponse()
		await authenticator.authenticate(request, response)
		expect(response.statusCode).toBe(403);
		expect(response._getData()).toBe(`Credentials not provided.`);
	});

	test(`Responds with 403 code and message about none existing user when username doesn't exist`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
			url: '/login',
			body: {
				email: 'failtast@google.com',
				password: '5431'
			}
		});
		
		const response = httpMocks.createResponse()
		await new Authenticator().authenticate(request, response)

		expect(response.statusCode).toBe(403);
		expect(response._getData()).toBe(`User doesn't exist.`);
	});

	test(`Responds with 403 code and message about incorrect password when wrong password`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
			url: '/login',
			body: {
					email: 'fake@softserveinc.com',
					password: '5431'
			}
		});
		const response = httpMocks.createResponse()

		await new Authenticator().authenticate(request, response)

		expect(response.statusCode).toBe(403);
		expect(response._getData()).toBe(`Incorrect password.`);
	});

	test(`Responds with 200 code and jwt when login is successful`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
			url: '/login',
			body: {
					email: 'fake@softserveinc.com',
					password: 'pass123'
			}
		});
		
		const response = httpMocks.createResponse()
		await new Authenticator().authenticate(request, response)

		expect(response.statusCode).toBe(200);
		const token = await new Session().fetchToken(response._getData())

		expect(token).toBe(response._getData())
		await (new Session().delete(response._getData()))
	});
})
