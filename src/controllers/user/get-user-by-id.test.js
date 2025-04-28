import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import { user } from '../../tests/fixtures/index.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCaseStub)

        return { sut, getUserByIdUseCaseStub }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if a user is found', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if the user id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_user_id',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if the user is not found', async () => {
        // Arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCaseStub, 'execute')
            .mockResolvedValue(null)

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        // Arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCaseStub, 'execute')
            .mockRejectedValue(new Error())

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // Arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdUseCaseStub,
            'execute',
        )

        // Act
        await sut.execute(httpRequest)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
