import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updatedUserParams) {
        if (updatedUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
                    updatedUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updatedUserParams.email)
            }
        }

        const user = {
            ...updatedUserParams,
        }

        if (updatedUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updatedUserParams.password,
            )

            user.password = hashedPassword
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
