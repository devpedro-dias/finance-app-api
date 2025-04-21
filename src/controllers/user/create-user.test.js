import { CreateUserController } from './create-user.js'

describe('CreateUserController', () => {
    class CreateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    it('should returns 201 when creating an user successfully', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
            },
        }

        // Act
        const result = await createUserController.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should returns 400 if first_name is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
            },
        }

        // Act
        const result = await createUserController.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should returns 400 if last_name is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                email: 'john.doe@example.com',
                password: '123456',
            },
        }

        // Act
        const result = await createUserController.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(400)
    })
})
