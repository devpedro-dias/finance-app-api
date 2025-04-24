import { EmailAlreadyInUseError } from '../../errors/user'
import { UpdateUserUseCase } from './update-user'
 import { faker } from '@faker-js/faker'
 
 describe('UpdateUserUseCase', () => {
     const user = {
         id: faker.string.uuid(),
         first_name: faker.person.firstName(),
         last_name: faker.person.lastName(),
         email: faker.internet.email(),
         password: faker.internet.password({
             length: 7,
         }),
     }
 
     class GetUserByEmailRepositoryStub {
         async execute() {
             return null
         }
     }
 
     class PasswordHasherAdapterStub {
         async execute() {
             return 'hashed_password'
         }
     }
 
     class UpdateUserRepositoryStub {
         async execute() {
             return user
         }
     }
 
     const makeSut = () => {
         const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
         const updateUserRepository = new UpdateUserRepositoryStub()
         const passwordHasherAdapter = new PasswordHasherAdapterStub()
 
         const sut = new UpdateUserUseCase(
             getUserByEmailRepository,
             updateUserRepository,
             passwordHasherAdapter,
         )
 
         return {
             sut,
             getUserByEmailRepository,
             updateUserRepository,
             passwordHasherAdapter,
         }
     }
 
     it('should update user successfully (without email and password)', async () => {
         // Arrange
         const { sut } = makeSut()
 
         // Act
         const result = await sut.execute(faker.string.uuid(), {
             first_name: faker.person.firstName(),
             last_name: faker.person.lastName(),
         })
 
         // Assert
         expect(result).toBe(user)
     })

     it('should update user successfully (with email)', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )
        const email = faker.internet.email()

        // Act
        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        // Assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const password = faker.internet.password()

        // Act
        const result = await sut.execute(faker.string.uuid(), {
            password,
        })

        // Assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

        // act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        // assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
 })