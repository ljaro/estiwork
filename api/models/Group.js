


module.exports = {
	
	
	attributes:{
		name: {type: 'string'},
		workers: {collection: 'worker', via: 'group'}
	}
}