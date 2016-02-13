#include "RabbitMessageSender.h"

#include <amqp_tcp_socket.h>
#include <amqp.h>
#include <amqp_framing.h>
#include "utils.h"

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
		pantheios::log_CRITICAL("creating TCP socket");
	}

	int status = amqp_socket_open(socket, "127.0.0.1", 5672);
	if (status) {
		pantheios::log_CRITICAL("opening TCP socket");
	}


	die_on_amqp_error(amqp_login(conn, "/", 0, 131072, 0, AMQP_SASL_METHOD_PLAIN, "guest", "guest"),
		"Logging in");
	amqp_channel_open(conn, 1);
	die_on_amqp_error(amqp_get_rpc_reply(conn), "Opening channel");

	//send_batch(conn, "queue1", rate_limit, message_count);

}

void RabbitMessageSender::close()
{
	die_on_amqp_error(amqp_channel_close(conn, 1, AMQP_REPLY_SUCCESS), "Closing channel");
	die_on_amqp_error(amqp_connection_close(conn, AMQP_REPLY_SUCCESS), "Closing connection");
	die_on_error(amqp_destroy_connection(conn), "Ending connection");
}

void RabbitMessageSender::sendOne(std::vector<uint8_t>& msgBuffer)
{

	char message[256];
	amqp_bytes_t message_bytes;
	message_bytes.len = msgBuffer.size();
	message_bytes.bytes = msgBuffer.data();

	die_on_error(amqp_basic_publish(conn,
		1,
		amqp_cstring_bytes(""),
		amqp_cstring_bytes("exchange_key1"),
		0,
		0,
		NULL,
		message_bytes),
		"Publishing");
}