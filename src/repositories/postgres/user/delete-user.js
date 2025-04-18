import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            return null
        }
    }
}
