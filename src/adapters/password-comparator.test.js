import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { PasswordComparatorAdapter } from './password-comparator'

describe('PasswordComparatorAdapter', () => {
    it('should return true if password matches the hash', async () => {
        const sut = new PasswordComparatorAdapter()
        const password = faker.internet.password()
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await sut.execute(password, hashedPassword)

        expect(result).toBe(true)
    })

    it('should return false if password does not match the hash', async () => {
        const sut = new PasswordComparatorAdapter()
        const password = faker.internet.password()
        const hashedPassword = await bcrypt.hash(faker.internet.password(), 10)

        const result = await sut.execute(password, hashedPassword)

        expect(result).toBe(false)
    })
})
