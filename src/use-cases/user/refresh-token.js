import { UnathorizedError } from '../../errors/index.js'

export class RefreshToken {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET
            )

            if(!decodedToken) {
                throw new UnathorizedError()
            }

            return this.tokensGeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            console.error(error)
            throw new UnathorizedError()
        }
    }
}