import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests/fixtures/index.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'

describe('GetTransactionsByUserIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 when finding transaction by user id succesfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing userId on query', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            query: {
                userId: undefined,
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when userId is not valid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            query: {
                userId: 'invalid_user_id',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        // Act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const result = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        const userId = faker.string.uuid()

        // Act
        await sut.execute({
            query: { userId: userId },
        })

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
