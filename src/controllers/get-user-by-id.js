import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, notFound, ok, serverError } from './helpers/http.js'
import { checkIfIdIsValid } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)
            
            if (!isIdValid) {
                return badRequest({
                    message: 'The provided id is not valid.',
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId
            )

            if (!user) {
                return notFound({
                    message: 'User not found',
                })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
