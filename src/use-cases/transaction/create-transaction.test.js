import { UserNotFoundError } from '../../errors/user'
import { transaction, user } from '../../tests/fixtures/index.js'
import { CreateTransactionUseCase } from './create-transaction'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class UuidGeneratorAdapterStub {
        execute() {
            return 'random_uuid'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const uuidGeneratorAdapter = new UuidGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new CreateTransactionUseCase(
            getUserByIdRepository,
            createTransactionRepository,
            uuidGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            uuidGeneratorAdapter,
            getUserByIdRepository,
        }
    }

    it('should create transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(createTransactionParams)

        // Assert
        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call UuidGeneratorAdapter', async () => {
        // Arrange
        const { sut, uuidGeneratorAdapter } = makeSut()
        const executeSpy = jest.spyOn(uuidGeneratorAdapter, 'execute')

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(executeSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params', async () => {
        // Arrange
        const { sut, createTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(createTransactionRepository, 'execute')

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_uuid',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if UuidGeneratorAdapter throws', async () => {
        // Arrange
        const { sut, uuidGeneratorAdapter } = makeSut()
        jest.spyOn(uuidGeneratorAdapter, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        // Arrange
        const { sut, createTransactionRepository } = makeSut()
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
