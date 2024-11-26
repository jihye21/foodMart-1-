package com.example.demo.command;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class UserCommand {
	String id;
	String password;
	String name;
	String addr;
	String addrDetail;
	String post;
	Number phone;
	String email;
}
