import { PostgresDeleteUserRepository } from "../repositories/postgres"

export class DeleteUserUseCase {
    async execute(userId) {
        const postgredDeletedUserRepository = new PostgresDeleteUserRepository()

        const deletedUser = await postgredDeletedUserRepository.execute(userId)

        return deletedUser
    }
}
