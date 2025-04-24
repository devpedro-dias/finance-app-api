import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
 
 describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }
 
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
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
        const transationId = faker.string.uuid()
 
        // Act
        const result = await sut.execute(transationId)
 
        // Assert
        expect(result).toEqual({
            ...transaction,
            id: transationId,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // Arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
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