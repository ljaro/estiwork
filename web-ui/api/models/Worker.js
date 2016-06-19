/**
 * Copyright (C) Łukasz Jaroszewski, All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


module.exports = {


	attributes:{
		login:{type:'string'},
		fullname:{type:'string'},
    info:{type:'string'},
		leader: {model:'worker'},
		workers: {collection:'worker', via:'leader'},
		group: {model:'group'}
	}
}
