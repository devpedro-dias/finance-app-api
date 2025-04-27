import { CreateUserController, GetUserByIdController } from '../../controllers'
import { makeCreateUserController, makeGetUserByIdController } from './user'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instace', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instace', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
