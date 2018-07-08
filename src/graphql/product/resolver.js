const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const productMocks = [
	{ id: 1, name: 'Product A', shortDescription: 'First product.' }, 
	{ id: 2, name: 'Product B', shortDescription: 'Second product.' }]

// Replace this mock with your own code.
const _searchProducts = ({ id }) => Promise.resolve(null).then(() => id ? productMocks.filter(p => p.id == id) : productMocks)

// Replace this mock with your own code.
const _insertNewProduct = product => Promise.resolve(null).then(() => {
	const newId = productMocks.sort((a,b) => a.id < b.id)[0].id + 1
	const newProduct = Object.assign({ id: newId }, product)
	productMocks.push(newProduct)
	return newProduct
}) 

exports.resolver = {
	Query: {
		products(root, { id }, context) {
			// context.searchProducts is used for unit testing
			const searchProducts = context.searchProducts || _searchProducts
			return searchProducts({ id }).then(results => {
				if (results.length > 0)
					return results
				else
					throw context.graphqlError(404, `Product with id ${id} does not exist.`)
			})
		}
	},

	Mutation: {
		productInsert(root, { product }, context) {
			if (!product || !product.name)
				throw context.graphqlError('Missing required argument \'product.name\'.')

			// context.insertNewProduct is used for unit testing
			const insertNewProduct = context.insertNewProduct || _insertNewProduct
			return insertNewProduct(product).then(newProduct => {
				pubsub.publish('productInserted', { productInserted: newProduct })
				return newProduct
			})
		}
	},

	Subscription: {
		productInserted: {
			subscribe: () => pubsub.asyncIterator('productInserted')
		}
	}
}
