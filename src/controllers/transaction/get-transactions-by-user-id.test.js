import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'

describe('GetTransactionsByUserIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return [
                {
                    id: faker.string.uuid(),
                    user_id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    date: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
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
})
