import { get } from "http"
import { GetUserByIdUseCase } from "./get-user-by-id"

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
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
            getUserByIdRepository
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
})