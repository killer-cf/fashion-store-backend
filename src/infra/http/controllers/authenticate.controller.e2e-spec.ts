import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate session (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let bcryptHasher: BcryptHasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    bcryptHasher = new BcryptHasher()

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Kilder costa',
        email: 'costa@gmail.com',
        password: await bcryptHasher.hash('password'),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'costa@gmail.com',
      password: 'password',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})
