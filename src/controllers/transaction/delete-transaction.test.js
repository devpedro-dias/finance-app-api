import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
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
        },
    }

    it('should return 200 when DeleteTransactionUseCase returns a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
    })
})
