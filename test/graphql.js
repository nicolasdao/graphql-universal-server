const { assert } = require('chai')
const { transpileSchema } = require('graphql-s2s').graphqls2s
const { makeExecutableSchema } = require('graphql-tools')
const glue = require('schemaglue')

const { schema, resolver } = glue('./src/graphql')

describe('graphql', () => {
	describe('Schema', () => {
		it('01 - Should transpile the schema just fine.', () => {
			assert.isOk(transpileSchema(schema))
		})
		it('02 - Should compile the schema just fine', () => {
			try {
				const executableSchema = makeExecutableSchema({
					typeDefs: transpileSchema(schema),
					resolvers: resolver
				})
				assert.isOk(executableSchema)
			} catch(err) {
				assert.isNotOk(err, `${err.message}\n${err.stack}`)
			}
		})
	})
})

