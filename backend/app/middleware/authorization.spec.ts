import httpMocks from 'node-mocks-http'
import * as fs from 'fs';
import * as path from 'path'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { isAuthorized } from './authorization'

const cert: string  = fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8');
const token = jwt.sign({userID: 1234, email: "email"}, cert, {algorithm: 'RS256'});


beforeAll(async () => {
	await db.execute(`
		INSERT INTO sessions 
		(token) 
    VALUES (?)`,
    [token]
	)
})

afterAll(async () => {
	await db.execute(`
		DELETE from sessions
    WHERE token = ?`,
    [token]
	)
})

describe('Authorization middleware', () => {
  test(`Responds with 403 code and token not provieded message when token isn't provieded in the request`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
			url: '/login',
		});
		
    const response = httpMocks.createResponse()
    const next = jest.fn()

    await isAuthorized(request, response, next)
		expect(response.statusCode).toBe(403);
		expect(response._getData()).toBe(`Token not provided`);
  });
  
  test(`Responds with 403 code and unauthorized message when token isn't valid`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
      url: '/login',
      headers: {
        Authorization: 'Bearer faketoken.faketoken'
      }
    });
		
    const response = httpMocks.createResponse()
    const next = jest.fn()
    await isAuthorized(request, response, next)
		expect(response.statusCode).toBe(403);
		expect(response._getData()).toBe('Unauthorized');
  });
  
  test(`Calls next function when authorization is succesful`, async () => {
		const request  = httpMocks.createRequest({
			method: 'POST',
      url: '/login',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
		
    const response = httpMocks.createResponse()
    const next = jest.fn()
    await isAuthorized(request, response, next)
		expect(next).toBeCalledTimes(1)
	});
})

