import { UnauthorizedError } from '../../errors'
import { RefreshTokenUseCase } from './refresh-token'

describe('RefreshTokenUseCase', () => {
    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }
    const makeSut = () => {
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokenVerifierAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should return new tokens', () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'

        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw if tokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        expect(() => sut.execute('any_refresh_token')).toThrow(
            new UnauthorizedError(),
        )
    })
})
