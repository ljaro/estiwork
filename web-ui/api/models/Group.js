/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


module.exports = {
	
	
	attributes:{
		name: {type: 'string'},
		workers: {collection: 'worker', via: 'group'}
	}
}
