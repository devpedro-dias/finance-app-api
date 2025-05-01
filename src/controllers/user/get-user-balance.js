import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getUserBalanceSchema } from '../../schemas/user.js'
import {
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpsRequest) {
        try {
            const userId = httpsRequest.params.userId
            const from = httpsRequest.query.from
            const to = httpsRequest.query.to

            await getUserBalanceSchema.parseAsync({ user_id: userId, from, to })

            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            console.error(error)
            return serverError(error)
        }
    }
}
