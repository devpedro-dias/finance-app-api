import { GetUserByIdController } from '../../controllers'
import { makeGetUserByIdController } from './user'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instace', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
