import { ProductDetails } from '@/domain/store/enterprise/entities/value-objects/product-details'
import { ImagePresenter } from './image-presenter'
import { CategoryPresenter } from './category-presenter'

export class ProductDetailsPresenter {
  static toHTTP(product: ProductDetails) {
    return {
      id: product.productId.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      model: product.model,
      colors: product.colors,
      status: product.status.toString(),
      brand: {
        id: product.brandId.toString(),
        name: product.brandName,
      },
      images: product.images.map(ImagePresenter.toHTTP),
      categories: product.categories.map(CategoryPresenter.toHTTP),
    }
  }
}
