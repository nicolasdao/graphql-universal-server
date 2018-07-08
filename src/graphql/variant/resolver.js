const variantMocks = [
	{ id: 1, name: 'Variant A', shortDescription: 'First variant.' }, 
	{ id: 2, name: 'Variant B', shortDescription: 'Second variant.' }]

// Replace this mock with your own code.
const _searchVariants = ({ id }) => Promise.resolve(null).then(() => id ? variantMocks.filter(p => p.id == id) : variantMocks)

exports.resolver = {
	Query: {
		variants(root, { id }, context) {
			// context.searchVariants is used for unit testing
			const searchVariants = context.searchVariants || _searchVariants
			return searchVariants({ id }).then(results => {
				if (results.length > 0)
					return results
				else
					throw context.graphqlError(404, `Variant with id ${id} does not exist.`)
			})
		}
	}
}
