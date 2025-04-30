import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'
import { transaction } from '../../tests/fixtures/index.js'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should create a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        // Assert
        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        // Act
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
            amount: transaction.amount,
        })
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
