import { faker } from '@fake-jsr/faker'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }
    
    const user = {
        id: 'existing_user_id',
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class UuidGeneratorAdapterStub {
        execute() {
            return 'random_uuid'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                ...user,
                id: userId
            }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const uuidGeneratorAdapter = new UuidGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
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
        expect(result).toEqual({...createTransactionParams, id: 'random_uuid'})
    })
})