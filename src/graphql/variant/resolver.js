const variantMocks = [{ id: 1, name: 'Variant A', shortDescription: 'First variant.' }, { id: 2, name: 'Variant B', shortDescription: 'Second variant.' }]

exports.resolver = {
	Query: {
		variants(root, { id }, context) {
			const results = id ? variantMocks.filter(p => p.id == id) : variantMocks
			if (results.length > 0)
				return results
			else
				throw context.graphqlError(404, `Variant with id ${id} does not exist.`)
		}
	}
}
