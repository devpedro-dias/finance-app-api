import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
    async execute(userId, updatedUserParams) {
        if (updatedUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updatedUserParams.email
                )

            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError(updatedUserParams.email)
            }
        }

        const user = {
            ...updatedUserParams,
        }

        if (updatedUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updatedUserParams.password,
                10
            )

            user.password = hashedPassword
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user
        )

        return updatedUser
    }
}
