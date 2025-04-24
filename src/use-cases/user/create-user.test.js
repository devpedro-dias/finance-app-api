import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        execute() {
            return 'hashed_password'
        }
    }

    class UuidGeneratorAdapterStub {
        execute() {
            return 'generated_uuid'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const uuidGeneratorAdapter = new UuidGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            uuidGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            uuidGeneratorAdapter,
        }
    }

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const createdUser = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        })

        // Assert
        expect(createdUser).toBeTruthy()
    })
})
