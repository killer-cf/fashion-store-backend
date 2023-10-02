import { UploadAndCreateImageUseCase } from './upload-and-create-image'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { FakeUploader } from 'test/storage/faker-uploader'
import { InvalidImageType } from './errors/invalid-image-type'

describe('Upload and create image', () => {
  let inMemoryImagesRepository: InMemoryImagesRepository
  let fakeUploader: FakeUploader
  let sut: UploadAndCreateImageUseCase

  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateImageUseCase(
      inMemoryImagesRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an image', async () => {
    const result = await sut.execute({
      fileName: 'test.jpeg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      image: inMemoryImagesRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'test.jpeg',
      }),
    )
  })

  it('should not be able to upload an image with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageType)
  })
})
