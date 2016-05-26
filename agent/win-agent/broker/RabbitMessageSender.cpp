#include "RabbitMessageSender.h"

#include "Winsock2.h"

#include <amqp_tcp_socket.h>
#include <amqp.h>
#include <amqp_framing.h>
#include "utils.h"

#include <boost\date_time\posix_time\posix_time.hpp>
#include <boost\thread.hpp>

RabbitMessageSender::RabbitMessageSender()
{
}


RabbitMessageSender::~RabbitMessageSender()
{
}



#define SUMMARY_EVERY_US 1000000

static void send_batch(amqp_connection_state_t conn,
	char const *queue_name,
	int rate_limit,
	int message_count)
{
	uint64_t start_time = now_microseconds();
	int i;
	int sent = 0;
	int previous_sent = 0;
	uint64_t previous_report_time = start_time;
	uint64_t next_summary_time = start_time + SUMMARY_EVERY_US;

	char message[256];
	amqp_bytes_t message_bytes;

	for (i = 0; i < (int)sizeof(message); i++) {
		message[i] = i & 0xff;
	}

	message_bytes.len = sizeof(message);
	message_bytes.bytes = message;

	for (i = 0; i < message_count; i++) {
		uint64_t now = now_microseconds();

		die_on_error(amqp_basic_publish(conn,
			1,
			amqp_cstring_bytes(""),
			amqp_cstring_bytes(queue_name),
			0,
			0,
			NULL,
			message_bytes),
			"Publishing");
		sent++;
		if (now > next_summary_time) {
			int countOverInterval = sent - previous_sent;
			double intervalRate = countOverInterval / ((now - previous_report_time) / 1000000.0);
			printf("%d ms: Sent %d - %d since last report (%d Hz)\n",
				(int)(now - start_time) / 1000, sent, countOverInterval, (int)intervalRate);

			previous_sent = sent;
			previous_report_time = now;
			next_summary_time += SUMMARY_EVERY_US;
		}

		while (((i * 1000000.0) / (now - start_time)) > rate_limit) {
			microsleep(2000);
			now = now_microseconds();
		}
	}

  {
	  uint64_t stop_time = now_microseconds();
	  int total_delta = stop_time - start_time;

	  printf("PRODUCER - Message count: %d\n", message_count);
	  printf("Total time, milliseconds: %d\n", total_delta / 1000);
	  printf("Overall messages-per-second: %g\n", (message_count / (total_delta / 1000000.0)));
  }
}

void RabbitMessageSender::init()
{
	int rate_limit = 1000;
	int message_count = 10000000;
	
	conn = amqp_new_connection();
	socket = amqp_tcp_socket_new(conn);
	if (!socket) {		
		BOOST_LOG_TRIVIAL(fatal) << "creating TCP socket";
	}

	int status = amqp_socket_open(socket, "127.0.0.1", 5672);
	if (status) {		
		BOOST_LOG_TRIVIAL(fatal) << "opening TCP socket";
	}


	die_on_amqp_error(amqp_login(conn, "/", 0, 131072, 0, AMQP_SASL_METHOD_PLAIN, "guest", "guest"),
		"Logging in");
	amqp_channel_open(conn, 1);
	die_on_amqp_error(amqp_get_rpc_reply(conn), "Opening channel");

	//send_batch(conn, "queue1", rate_limit, message_count);

}

void RabbitMessageSender::close()
{
	amqp_channel_close(conn, 1, AMQP_REPLY_SUCCESS);
	amqp_connection_close(conn, AMQP_REPLY_SUCCESS);
	amqp_destroy_connection(conn);
}

bool RabbitMessageSender::Publish(amqp_bytes_t& message)
{
	int result = amqp_basic_publish(conn,
		1,
		amqp_cstring_bytes(""),
		amqp_cstring_bytes("exchange_key1"),
		0,
		0,
		NULL,
		message);

	if (result != AMQP_STATUS_OK)
	{
		amqp_status_enum resCodes = static_cast<amqp_status_enum>(result);

		switch (resCodes)
		{
		case AMQP_STATUS_TIMER_FAILURE:
		case AMQP_STATUS_HEARTBEAT_TIMEOUT:
		case AMQP_STATUS_NO_MEMORY:
		case AMQP_STATUS_TABLE_TOO_BIG:
		case AMQP_STATUS_CONNECTION_CLOSED:
		case AMQP_STATUS_SSL_ERROR:
		case AMQP_STATUS_TCP_ERROR:			
			BOOST_LOG_TRIVIAL(error) << "Rabbit publishing error " << resCodes << ", " << WSAGetLastError();
			break;

		default:			
			BOOST_LOG_TRIVIAL(error) << "Rabbit publishing other error " << resCodes << ", " << WSAGetLastError();
			break;
		}		
	}
	else
	{
		//pantheios::log_NOTICE("Rabbit publishing OK");		
	}

	return AMQP_STATUS_OK == result;
}

void RabbitMessageSender::sendOne(std::vector<uint8_t>& msgBuffer)
{
	
	amqp_bytes_t message_bytes;
	message_bytes.len = msgBuffer.size();
	message_bytes.bytes = msgBuffer.data();

	while (1)
	{
		bool result = Publish(message_bytes);

		if (result)
			break;

		boost::this_thread::sleep(boost::posix_time::millisec(1000));
		
		close();
		init();
	}
}