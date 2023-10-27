import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { AdminFactory } from 'test/factories/make-admin'

describe('Edit category (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /categories/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const category = await categoryFactory.makePrismaCategory({
      name: 'Computadores',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Eletrônicos',
      })

    expect(response.statusCode).toBe(204)

    const categoryEdited = await prisma.category.findFirst({
      where: {
        name: 'Eletrônicos',
      },
    })

    expect(categoryEdited).toBeTruthy()
  })

  test('[PUT] /categories/:id (Unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const category = await categoryFactory.makePrismaCategory({
      name: 'Computadores',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Eletrônicos',
      })

    expect(response.statusCode).toBe(403)
  })
})
