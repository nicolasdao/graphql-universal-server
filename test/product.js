const { assert } = require('chai')
const { graphqlError } = require('graphql-serverless')
const { resolver: { Query, Mutation } } = require('../src/graphql/product/resolver')

const productMocks = [
	{ id: 1, name: 'Product A', shortDescription: 'First product.' }, 
	{ id: 2, name: 'Product B', shortDescription: 'Second product.' }]

const context = {
	graphqlError,
	searchProducts: ({ id }) => Promise.resolve(null).then(() => id ? productMocks.filter(p => p.id == id) : productMocks),
	insertNewProduct: product => Promise.resolve(null).then(() => {
		const newId = productMocks.sort((a,b) => a.id < b.id)[0].id + 1
		const newProduct = Object.assign({ id: newId }, product)
		productMocks.push(newProduct)
		return newProduct
	})
} 

describe('product', () => {
	describe('Query', () => 
		describe('#products', () => {
			it('Should return a single product if we search by id.', () => {
				return Query.products(null, { id: 1 }, context)
					.catch(err => assert.equal(1,0, `Something went wrong: ${err.message}`))
					.then(result => {
						assert.isOk(result)
						assert.isOk(Array.isArray(result))
						assert.equal(result.length, 1)
						assert.equal(result[0].id, 1)
						assert.equal(result[0].name, 'Product A')
						assert.equal(result[0].shortDescription, 'First product.')
					}) 
			}),
			it('Should return all products if no parameters are passed.', () => {
				return Query.products(null, {}, context)
					.catch(err => assert.equal(1,0, `Something went wrong: ${err.message}`))
					.then(result => {
						assert.isOk(result)
						assert.isOk(Array.isArray(result))
						assert.equal(result.length, 2)
						assert.equal(result[0].id, 1)
						assert.equal(result[0].name, 'Product A')
						assert.equal(result[0].shortDescription, 'First product.')
						assert.equal(result[1].id, 2)
						assert.equal(result[1].name, 'Product B')
						assert.equal(result[1].shortDescription, 'Second product.')
					}) 
			}),
			it('Should fail with an HTTP 404 if the id is not found.', () => {
				return Query.products(null, { id: 10 }, context)
					.catch(error => ({ error }))
					.then(({ error }) => {
						if (error) {
							const e = JSON.parse(error.message)
							assert.equal(e.httpCode, 404)
							assert.equal(e.message, 'Product with id 10 does not exist.')
						} else
							assert.equal(0,1, 'Searching for product id 10 should fail.')
					}) 
			})})),
	describe('Mutation', () => 
		describe('#productInsert', () => {
			it('Should auto-increment the id of a new product.', () => {
				const newProduct = {
					name: 'Doris Macadam',
					shortDescription: 'Third product.'
				}
				return Mutation.productInsert(null, { product: newProduct }, context)
				.catch(err => assert.equal(1,0, `Something went wrong: ${err.message}`))
				.then(p => {
					assert.isOk(p)
					assert.equal(p.id, 3)
					assert.equal(p.name, newProduct.name)
					assert.equal(p.shortDescription, newProduct.shortDescription)
					assert.equal(productMocks.length, 3)
				})
			})}))
})