import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CategoryFactory } from 'test/factories/make-category'

describe('Admin Delete category (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[DELETE] /categories/:code', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const category = await categoryFactory.makePrismaCategory()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .delete(`/categories/${category.id.toString()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /categories/:code (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const category = await categoryFactory.makePrismaCategory()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .delete(`/categories/${category.id.toString()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
