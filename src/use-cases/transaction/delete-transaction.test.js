import { faker } from '@faker-js/faker'
import { transaction } from '../../tests/fixtures/index.js'
import { DeleteTransactionUseCase } from './delete-transaction'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()
        const transactionId = faker.string.uuid()

        // Act
        const result = await sut.execute(transactionId)

        // Assert
        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // Arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')
        const transactionId = faker.string.uuid()

        // Act
        await sut.execute(transactionId)

        // Axpect
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        // Arrange
        const { sut, deleteTransactionRepository } = makeSut()

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const transactionId = faker.string.uuid()

        // Act
        const promise = sut.execute(transactionId)

        // Axpect
        await expect(promise).rejects.toThrow()
    })
})
