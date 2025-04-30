import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            return response.status(401).send({ message: 'Unathorized' })
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return response.status(401).send({ message: 'Unathorized' })
        }

        request.userId = decodedToken.userId

        next()
    } catch (error) {
        console.error(error)
        return response.status(401).send({ message: 'Unathorized' })
    }
}
