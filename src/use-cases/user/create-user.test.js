import { EmailAlreadyInUseError } from '../../errors/user'
import { user as fixtureUser } from '../../tests/fixtures/index.js'
import { CreateUserUseCase } from './create-user'

describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }

    class GetUserByEmailRepositoryStub {
        execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        execute() {
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

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }
    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const uuidGeneratorAdapter = new UuidGeneratorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            uuidGeneratorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            uuidGeneratorAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const createdUser = await sut.execute(user)

        // Assert
        expect(createdUser).toBeTruthy()
        expect(createdUser.tokens.accessToken).toBeDefined()
        expect(createdUser.tokens.refreshToken).toBeDefined()
    })

    it('should throw an EmailAlreadyInUseError if the email is already in use', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockReturnValueOnce(user)

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

        const uuidSpy = import.meta.jest.spyOn(uuidGeneratorAdapter, 'execute')
        const createUserSpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

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

        const passwordHasherSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const createUserSpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

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

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if UuidGeneratorAdapter throws', async () => {
        // Arrange
        const { sut, uuidGeneratorAdapter } = makeSut()

        import.meta.jest
            .spyOn(uuidGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut()

        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        // Arrange
        const { sut, createUserRepository } = makeSut()

        import.meta.jest
            .spyOn(createUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
