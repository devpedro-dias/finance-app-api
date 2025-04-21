import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return {
            sut,
            createTransactionUseCase,
        }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when CreateTransactionUseCase returns a transaction successfully (EXPENSE)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when CreateTransactionUseCase returns a transaction successfully (EARNING)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: 'EARNING' },
        })

        // Assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when CreateTransactionUseCase returns a transaction successfully (INVESTMENT)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: 'INVESTMENT' },
        })

        // Assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user id', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: { ...httpRequest.body, user_id: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, name: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, date: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, amount: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, date: 'invalid_date' },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: 'INVALID_TYPE' },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })
})
