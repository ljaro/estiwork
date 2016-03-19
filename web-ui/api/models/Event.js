


module.exports = {


	attributes:{

    /**
     * this are original message from fields
     */
		probe_time:{type:'datetime'},
    duration:{type:'integer'},
    user:{type:'json'},
    machine:{type:'json'},
    sample:{type:'json'},

    /**
     * This are helper calculated fields
     */
    app_category:{type:'string'},
    worker_id:{model:'worker'},
    workstation_id:{model:'workstation'}
	}
}
