import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../use-cases/index.js'
import { PasswordHasherAdapter } from '../../adapters/password-hasher.js'
import { UuidGeneratorAdapter } from '../../adapters/uuid-generator.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const createUserRepository = new PostgresCreateUserRepository()
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const uuidGeneratorAdapter = new UuidGeneratorAdapter()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        uuidGeneratorAdapter,
    )
    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    )
    const updateUserControler = new UpdateUserController(updateUserUseCase)

    return updateUserControler
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}

export const makeGetUserBalanceController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserByIdRepository,
        getUserBalanceRepository,
    )
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )

    return getUserBalanceController
}
