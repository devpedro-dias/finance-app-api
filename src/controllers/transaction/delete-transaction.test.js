import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'
import { transaction } from '../../tests/fixtures/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return {
            sut,
            deleteTransactionUseCase,
        }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
            user_id: faker.string.uuid(),
        },
    }

    it('should return 200 when deleting a transaction succesfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: {
                transactionId: 'invalid_id',
                user_id: faker.string.uuid(),
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionController throws', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()
        const userId = faker.string.uuid()

        // Act
        await sut.execute({
            params: {
                transactionId: transactionId,
                user_id: userId,
            },
        })

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
