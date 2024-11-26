package com.example.demo.signup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.service.email.EmailSendService;

@Service
public class EmailCheckService {
@Autowired
EmailSendService emailSendService;

	public void execute(String email) {
		String contents = "<html><body>"; 
		   contents += "[핑핑이] 회원가입 인증 문자입니다.";
		   contents +="</body></html>";
		String subject = "회원가입 인증문자";
		String fromEmail = "soongmoostudent@gmail.com";
		String toEmail = email;
		emailSendService.mailSend(fromEmail, toEmail, subject, contents);
		
	}
	
}
