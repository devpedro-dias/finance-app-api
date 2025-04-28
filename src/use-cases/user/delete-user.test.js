import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'
import { user } from '../../tests/fixtures/index.js'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepository)

        return { sut, deleteUserRepository }
    }

    it('should successfully delete an user', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const deletedUser = await sut.execute(faker.string.uuid())

        // Assert
        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            deleteUserRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(faker.string.uuid())

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
