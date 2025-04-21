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

    it('should return 400 if the user id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_user_id',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if the user is not found', async () => {
        // Arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()

        jest.spyOn(getUserByIdUseCaseStub, 'execute').mockResolvedValue(null)

        // Act
        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        // Assert
        expect(result.statusCode).toBe(404)
    })
})
