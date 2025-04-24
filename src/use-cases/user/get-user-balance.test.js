import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { GetUserBalanceUseCase } from './get-user-balance'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
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
        const result = await sut.execute(faker.string.uuid())

        // Assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId)

        // Assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut()

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
