import { EmailAlreadyInUseError } from '../errors/user.js'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository, PostgresGetUserByEmailRepository } from '../repositories/postgres/index.js'

export class UpdateUserUseCase {
    async execute(userId, updatedUserParams) {
        if (updatedUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
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

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
