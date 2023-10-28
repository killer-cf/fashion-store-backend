import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CategoryFactory } from 'test/factories/make-category'

describe('List categories (e2e)', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[GET] /categories', async () => {
    await Promise.all([
      categoryFactory.makePrismaCategory({
        name: 'Masculino',
      }),
      categoryFactory.makePrismaCategory({
        name: 'Feminino',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/categories')
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.categories).toHaveLength(2)
    expect(response.body.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Masculino' }),
        expect.objectContaining({ name: 'Feminino' }),
      ]),
    )
  })
})
