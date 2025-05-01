import request from 'supertest'
import { user } from '../tests/fixtures/index.js'
import { app } from '../app.js'

describe('Auth E2E Tests Route', () => {
    it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/auth/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/auth/refresh-token should return 200 and new tokens when refresh token is valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
