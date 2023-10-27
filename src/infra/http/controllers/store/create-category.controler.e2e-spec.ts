import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { SubCategoryFactory } from 'test/factories/make-sub-category'

describe('Create category (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, BrandFactory, SubCategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /categories', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo categoria',
      })

    expect(response.statusCode).toBe(201)

    const category = await prisma.category.findFirst({
      where: {
        name: 'Novo categoria',
      },
    })

    expect(category).toBeTruthy()
  })

  test('[POST] /categories (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo categoria',
      })

    expect(response.statusCode).toBe(403)
  })
})
