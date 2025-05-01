import { LoginUserController } from '../../controllers'
import { makeLoginUserController } from './auth'

describe('Auth Controller Factories', () => {
    it('should return a valid makeLoginUserController instance', () => {
        expect(makeLoginUserController()).toBeInstanceOf(LoginUserController)
    })
})
