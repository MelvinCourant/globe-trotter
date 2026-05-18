import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import app from "@adonisjs/core/services/app";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export default class extends BaseSeeder {
  async run() {
    const imagesDir = app.makePath('database/seeders/images/user')
    const uploadsDir = app.makePath('uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const [file] = await fs.readdir(imagesDir)
    const ext = path.extname(file)
    const newName = `${randomUUID()}${ext}`
    await fs.copyFile(path.join(imagesDir, file), path.join(uploadsDir, newName))

    await User.create({
      email: 'test@test.fr',
      password: 'testtest',
      firstname: 'John',
      lastname: 'Doe',
      image: newName,
    })
  }
}
