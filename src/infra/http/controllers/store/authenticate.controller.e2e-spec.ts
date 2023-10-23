import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'

describe('Authenticate session (e2e)', () => {
  let app: INestApplication
  let bcryptHasher: BcryptHasher
  let clientFactory: ClientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    clientFactory = moduleRef.get(ClientFactory)
    bcryptHasher = new BcryptHasher()

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await clientFactory.makePrismaClient({
      name: 'Kilder costa',
      email: 'costa@gmail.com',
      password: await bcryptHasher.hash('password'),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'costa@gmail.com',
      password: 'password',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})
