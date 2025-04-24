import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

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

    const user = {
        id: 'existing_user_id',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const createdUser = await sut.execute(user)

        // Assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if the email is already in use', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UuidGeneratorAdapter to generate a random uuid', async () => {
        // Arrange
        const { sut, uuidGeneratorAdapter, createUserRepository } = makeSut()

        const uuidSpy = jest.spyOn(uuidGeneratorAdapter, 'execute')
        const createUserSpy = jest.spyOn(createUserRepository, 'execute')

        // Act
        await sut.execute(user)

        // Assert
        expect(uuidSpy).toHaveBeenCalled()
        expect(createUserSpy).toHaveBeenCalledWith({
            ...user,
            id: 'generated_uuid',
            password: 'hashed_password',
        })
    })

    it('should call PasswordHasherAdapter to cryptograph the password', async () => {
        // Arrange
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserSpy = jest.spyOn(createUserRepository, 'execute')

        // Act
        await sut.execute(user)

        // Assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserSpy).toHaveBeenCalledWith({
            ...user,
            id: 'generated_uuid',
            password: 'hashed_password',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if UuidGeneratorAdapter throws', async () => {
        // Arrange
        const { sut, uuidGeneratorAdapter } = makeSut()

        jest.spyOn(uuidGeneratorAdapter, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut()

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
