export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        const user = this.getUserByIdRepository.execute(userId)

        return user
    }
}
