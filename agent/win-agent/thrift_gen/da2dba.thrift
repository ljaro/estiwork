namespace cpp rpc.thrift
namespace java thrift.compiled

struct Sample {
	1: optional string window_caption;
	2: optional string image_fs_name;
	3: optional string image_full_path;
	4: optional string resource_image_name;
	5: optional string hash;
}
	
typedef string user_presence;
typedef string work_mode_state;

const string ACTIVE = "ACTIVE";
const string IDLE 	= "IDLE";

const string BREAK  = "BREAK"
const string WORK_WITH_COMPUTER  = "WORK_WITH_COMPUTER"
const string WORK_WITHOUT_COMPUTER  = "WORK_WITHOUT_COMPUTER"
const string CUSTOM_1  = "CUSTOM_1"
	

struct User {
	1: required string user_sid;
	2: required string user_login;
	3: optional user_presence presence;
	4: optional work_mode_state work_mode;
}

struct Machine {
	1: required string machine_sid;
}

struct EventSample {
	1: required string probe_time;	
	2: optional i64 duration;
	3: User user;
	4: Machine machine;	
	5: Sample sample;
}


	
	

service LocalRpc {

  /**
   * A method definition looks like C code. It has a return type, arguments,
   * and optionally a list of exceptions that it may throw. Note that argument
   * lists and exception lists are specified using the exact same syntax as
   * field lists in struct or exception definitions.
   */

   void ping(),
   oneway void send(1: EventSample event)

}

