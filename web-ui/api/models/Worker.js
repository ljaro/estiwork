


module.exports = {
	
	
	attributes:{		
		login:{type:'string'},
		fullname:{type:'string'},
		leader: {model:'worker'},
		workers: {collection:'worker', via:'leader'},
		group: {model:'group'}
	}
}