import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCaseStub = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCaseStub)

        return { sut, updateUserUseCaseStub }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 10,
            }),
        },
    }

    it('should return 200 if the user is updated', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if invalid email is provided', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if invalid password is provided', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if user id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_user_id',
            },
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed field is provided', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowed_field: 'unallowed_value',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws', async () => {
        // Arrange
        const { sut, updateUserUseCaseStub } = makeSut()

        jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValue(
            new Error(),
        )

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        // Arrange
        const { sut, updateUserUseCaseStub } = makeSut()

        jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValue(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        // Arrange
        const { sut, updateUserUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(updateUserUseCaseStub, 'execute')

        // Act
        await sut.execute(httpRequest)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})
