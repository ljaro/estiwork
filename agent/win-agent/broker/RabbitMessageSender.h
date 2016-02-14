#pragma once
#include "stdafx.h"
#include <vector>
#include <stdint.h>
#include <amqp.h>

class RabbitMessageSender
{
public:
	RabbitMessageSender();
	~RabbitMessageSender();

	void init();
	void close();
	void sendOne(std::vector<uint8_t>& msgBuffer);
private:
	amqp_socket_t *socket;
	amqp_connection_state_t conn;
};

