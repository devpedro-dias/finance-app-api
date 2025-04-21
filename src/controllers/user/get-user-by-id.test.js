import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCaseStub)

        return { sut, getUserByIdUseCaseStub }
    }

    it('should return 200 if a user is found', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        // Assert
        expect(result.statusCode).toBe(200)
    })
})
