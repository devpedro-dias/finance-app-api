export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        const deletedUser = await this.deletedUserRepository.execute(userId)

        return deletedUser
    }
}
