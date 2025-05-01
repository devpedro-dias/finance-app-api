import jwt from 'jsonwebtoken'
import { TokensGeneratorAdapter } from './tokens-generator'

describe('TokensGeneratorAdapter', () => {
    const userId = 'user123'
    const accessSecret = 'access_secret'
    const refreshSecret = 'refresh_secret'

    beforeAll(() => {
        process.env.JWT_ACCESS_TOKEN_SECRET = accessSecret
        process.env.JWT_REFRESH_TOKEN_SECRET = refreshSecret
    })

    it('should generate valid access and refresh tokens', () => {
        const sut = new TokensGeneratorAdapter()
        const { accessToken, refreshToken } = sut.execute(userId)

        expect(typeof accessToken).toBe('string')
        expect(typeof refreshToken).toBe('string')

        const accessPayload = jwt.verify(accessToken, accessSecret)
        const refreshPayload = jwt.verify(refreshToken, refreshSecret)

        expect(accessPayload.userId).toBe(userId)
        expect(refreshPayload.userId).toBe(userId)
    })
})
