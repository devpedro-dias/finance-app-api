import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'
import { user } from '../../tests/fixtures/index.js'

describe('GetUserByIdUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    it('should get user by id successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(faker.string.uuid())

        // Assert
        expect(result).toEqual(user)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
