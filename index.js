const { graphqlHandler } = require('graphql-serverless')
const { transpileSchema } = require('graphql-s2s').graphqls2s
const { app } = require('webfunc')
const { makeExecutableSchema } = require('graphql-tools')
const { glue } = require('schemaglue')

const { schema, resolver } = glue('./src/graphql')

const executableSchema = makeExecutableSchema({
	typeDefs: transpileSchema(schema),
	resolvers: resolver
})

const graphqlOptions = {
	schema: executableSchema,
	graphiql: true,
	endpointURL: '/graphiql',
	context: {} // add whatever global context is relevant to you app
}

app.all(['/', '/graphiql'], graphqlHandler(graphqlOptions))

eval(app.listen('app', 4000))