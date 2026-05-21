import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import app from "@adonisjs/core/services/app";
import drive from '@adonisjs/drive/services/main'
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export default class extends BaseSeeder {
  async run() {
    const imagesDir = app.makePath('database/seeders/images/user')

    const [file] = await fs.readdir(imagesDir)
    const ext = path.extname(file)
    const key = `${randomUUID()}${ext}`
    const content = await fs.readFile(path.join(imagesDir, file))
    await drive.use().put(key, content)

    await User.create({
      email: 'test@test.fr',
      password: 'testtest',
      firstname: 'John',
      lastname: 'Doe',
      image: key,
    })
  }
}
