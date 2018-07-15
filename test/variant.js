const { assert } = require('chai')
const { graphqlError } = require('graphql-serverless')
const { resolver: { Query } } = require('../src/graphql/variant/resolver')

const variantMocks = [
	{ id: 1, name: 'Variant A', shortDescription: 'First variant.' }, 
	{ id: 2, name: 'Variant B', shortDescription: 'Second variant.' }]

const context = {
	graphqlError,
	searchVariants: ({ id }) => Promise.resolve(null).then(() => id ? variantMocks.filter(p => p.id == id) : variantMocks)
} 

describe('variant', () => 
	describe('Query', () => 
		describe('#variants', () => {
			it('01 - Should return a single variant if we search by id.', () => {
				return Query.variants(null, { id: 1 }, context)
					.catch(err => assert.equal(1,0, `Something went wrong: ${err.message}`))
					.then(result => {
						assert.isOk(result)
						assert.isOk(Array.isArray(result))
						assert.equal(result.length, 1)
						assert.equal(result[0].id, variantMocks[0].id)
						assert.equal(result[0].name, variantMocks[0].name)
						assert.equal(result[0].shortDescription, variantMocks[0].shortDescription)
					}) 
			})
			it('02 - Should fail with an HTTP 404 if the id is not found.', () => {
				return Query.variants(null, { id: 10 }, context)
					.catch(error => ({ error }))
					.then(({ error }) => {
						if (error) {
							const e = JSON.parse(error.message)
							assert.equal(e.httpCode, 404)
							assert.equal(e.message, 'Variant with id 10 does not exist.')
						} else
							assert.equal(0,1, 'Searching for variant id 10 should fail.')
					}) 
			})})))