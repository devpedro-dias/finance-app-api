import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(getUserByIdRepository, getUserBalanceRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            return UserNotFoundError()
        }

        const balance = await this.getUserBalanceRepository.execute(
            params.userId,
        )

        return balance
    }
}
