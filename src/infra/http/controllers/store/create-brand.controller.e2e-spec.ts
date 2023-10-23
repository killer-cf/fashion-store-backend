import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create brand (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /brands', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/brands')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Xiaomi',
      })

    expect(response.statusCode).toBe(201)

    const brand = await prisma.brand.findUnique({
      where: {
        name: 'Xiaomi',
      },
    })

    expect(brand).toBeTruthy()
  })

  test('[POST] /brands (Unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/brands')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Apple',
      })

    expect(response.statusCode).toBe(403)

    const brand = await prisma.brand.findUnique({
      where: {
        name: 'Apple',
      },
    })

    expect(brand).toBeFalsy()
  })
})
