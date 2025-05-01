import jwt from 'jsonwebtoken'
import { TokenVerifierAdapter } from './token-verifier'

describe('TokenVerifierAdapter', () => {
    const secret = 'test_secret'
    const payload = { userId: '123' }

    it('should return the payload if token is valid', () => {
        const sut = new TokenVerifierAdapter()
        const token = jwt.sign(payload, secret)

        const result = sut.execute(token, secret)

        expect(result.userId).toBe(payload.userId)
    })

    it('should throw if token is invalid', () => {
        const sut = new TokenVerifierAdapter()

        expect(() => sut.execute('invalid.token', secret)).toThrow()
    })
})
