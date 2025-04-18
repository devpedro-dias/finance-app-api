import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters',
    })

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        message: 'Email is already in use',
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })
