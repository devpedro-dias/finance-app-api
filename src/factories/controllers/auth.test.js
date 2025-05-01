import { LoginUserController, RefreshTokenController } from '../../controllers'
import { makeLoginUserController, makeRefreshTokenController } from './auth'

describe('Auth Controller Factories', () => {
    it('should return a valid makeLoginUserController instance', () => {
        expect(makeLoginUserController()).toBeInstanceOf(LoginUserController)
    })

    it('should return a valid makeRefreshTokenController instance', () => {
        expect(makeRefreshTokenController()).toBeInstanceOf(
            RefreshTokenController,
        )
    })
})
