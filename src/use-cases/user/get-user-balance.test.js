import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { from, to, user, userBalance } from '../../tests/fixtures/index.js'
import { GetUserBalanceUseCase } from './get-user-balance'

describe('GetUserBalanceUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserBalanceUseCase(
            getUserByIdRepository,
            getUserBalanceRepository,
        )

        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }

    it('should get user balance successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(faker.string.uuid(), from, to)

        // Assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValue(null)
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId, from, to)

        // Assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId, from, to)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId, from, to)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId, from, to)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId, from, to)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
