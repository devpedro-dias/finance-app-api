import { faker } from '@faker-js/faker'

describe('DeleteUserUseCase', () => {

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepository)

        return { stub, deleteUserRepository}
    }

    it('should successfully delete an user', async () => {
        // Arrange 
        const { sut } = makeSut()

        // Act 
        const deletedUser = await sut.execute(faker.string.uuid())

        // Assert
        expect(deletedUser).toEqual(user)
    })
})