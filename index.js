const { graphqlHandler, setupSubscriptions, graphqlError } = require('graphql-serverless')
const { transpileSchema } = require('graphql-s2s').graphqls2s
const { app } = require('webfunc')
const { makeExecutableSchema } = require('graphql-tools')
const glue = require('schemaglue')

const { schema, resolver } = glue('./src/graphql')

const executableSchema = makeExecutableSchema({
	typeDefs: transpileSchema(schema),
	resolvers: resolver
})

const graphqlOptions = {
	schema: executableSchema,
	graphiql: {
		endpoint: '/graphiql',
	},
	subscriptionsEndpoint: '/subscriptions', // Optional. Use this only if you want to use websocket to manage GraphQl Subscriptions.
	context: { // Add whatever global context is relevant to your app.
		graphqlError
	} 
}

app.all(['/', '/graphiql'], graphqlHandler(graphqlOptions))

// WARNING: The following code implements GraphQl Subscriptions over websocket. 
// 			This is NOT SUPPORTED by AWS Lambdas, Google Functions, or any other FaaS.
// 			Only Zeit Now Serverless supports this feature (both default and production config).
// 			
// If your app does not use GraphQl Subscriptions, you can replace the last piece of code below with:
// eval(app.listen('app', 4000))
eval(app.listen('app', 4000, () => setupSubscriptions(app.server, graphqlOptions)))

