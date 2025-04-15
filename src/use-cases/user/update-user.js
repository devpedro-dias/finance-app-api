import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
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
            const hashedPassword = await bcrypt.hash(
                updatedUserParams.password,
                10,
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
