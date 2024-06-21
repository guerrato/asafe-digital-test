import { autoInjectable, inject } from 'tsyringe'
import { UserInput, UserPictureUpdate, UserReply, UserUpdate, UserUpdateRole } from '../models/user.model'
import { IUserRepository } from '../repositories/user.repository'
import { formatEmail, formatPersonName, isCompleteName, isEmail, isEmpty } from '../utils/string'
import { generatePasswordHash } from '../utils/security'
import { saveFile, uploadFile } from '../utils/files'

export interface IUserService {
  create(user: UserInput): Promise<UserReply>
  update(user: UserUpdate): Promise<UserReply>
  updateRole(user: UserUpdateRole): Promise<UserReply>
  delete(id: string): Promise<void>
  list(): Promise<UserReply[]>
  get(id: string): Promise<UserReply>
  pictureUpload(id: string, picture: any): Promise<UserReply>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}
  async create(user: UserInput): Promise<UserReply> {
    try {
      if (isEmpty(process.env.SECRET_KEY)) throw new Error('SRV_VAR_MISSING: Internal Error: Variables missing')

      let { email, name, password } = user
      if (!isEmail(email)) throw new Error('You must provide a valid email')
      if (!isCompleteName(name)) throw new Error('You must provide a complete name')
      if (isEmpty(password)) throw new Error('You must provide a password')

      name = formatPersonName(name)
      email = formatEmail(email)
      password = await generatePasswordHash(password)

      return await this.userRepository.create({ email, name, password })
    } catch (error) {
      throw error
    }
  }

  async update(user: UserUpdate): Promise<UserReply> {
    if (isEmpty(user.id)) {
      throw new Error('User not found')
    }

    const existingUser = await this.userRepository.findById(user.id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Validate new user's name if informed
    if (!isEmpty(user.name)) {
      if (!isCompleteName(user.name)) {
        throw new Error('You must provide a complete name')
      }
      user.name = formatPersonName(user.name)
    }

    // Validate new user's email if informed
    if (!isEmpty(user.email)) {
      if (!isEmail(user.email)) {
        throw new Error('You must provide a valid email')
      }
      const email = formatEmail(user.email)
      const emailUser = await this.userRepository.findByEmail(email)

      if (emailUser && emailUser.id !== user.id) {
        throw new Error('Email already in use')
      }
    }

    // Validate new user's password if informed
    if (!isEmpty(user.password)) {
      user.password = await generatePasswordHash(user.password)
    }

    return await this.userRepository.update(user)
  }

  async updateRole(user: UserUpdateRole): Promise<UserReply> {
    if (isEmpty(user.id)) {
      throw new Error('User not found')
    }

    const existingUser = await this.userRepository.findById(user.id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    return await this.userRepository.update(user)
  }

  async delete(id: string): Promise<void> {
    try {
      if (isEmpty(id)) {
        throw new Error('User not found')
      }

      const existingUser = await this.userRepository.findById(id)
      if (!existingUser) {
        throw new Error('User not found')
      }

      await this.userRepository.delete(id)
    } catch (error) {
      throw error
    }
  }

  async list(): Promise<UserReply[]> {
    try {
      const users = await this.userRepository.list()
      return users.map(({ password, ...rest }) => rest)
    } catch (error) {
      throw error
    }
  }

  async get(id: string): Promise<UserReply> {
    try {
      if (isEmpty(id)) {
        throw new Error('User not found')
      }

      const user = await this.userRepository.findById(id)
      if (!user) {
        throw new Error('User not found')
      }

      const { password, ...rest } = user
      return rest
    } catch (error) {
      throw error
    }
  }

  async pictureUpload(id: string, formData: any): Promise<UserReply> {
    try {
      if (isEmpty(id)) {
        throw new Error('User not found')
      }

      const user = await this.userRepository.findById(id)
      if (!user) {
        throw new Error('User not found')
      }

      // const fileArray = await (formData.file as File).buffer
      const buffer = await formData.toBuffer()

      const uploadedFilePath = await uploadFile(buffer)

      return await this.userRepository.update({
        id,
        picture_name: formData.filename,
        picture_path: uploadedFilePath.files.path,
      } as UserPictureUpdate)
    } catch (error) {
      throw error
    }
  }
}
