import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        getUserByIdRepository,
        createTransactionRepository,
        uuidGeneratorAdapter,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.createTransactionRepository = createTransactionRepository
        this.uuidGeneratorAdapter = uuidGeneratorAdapter
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = this.uuidGeneratorAdapter.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
