package com.example.demo.signup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.command.UserCommand;
import com.example.demo.service.email.EmailSendService;
import com.example.demo.signup.service.CreateAccountService;
import com.example.demo.signup.service.EmailCheckService;

@Controller
@RequestMapping("signup")
public class SignupController {
	
	@GetMapping("signupPage")
	public String signupPage() {
		return "thymeleaf/signup/signupPage";
	}
	
	@PostMapping("signupPage")
	public String signupPagePost() {
		return "redirect:signupPage";
	}
	
	@Autowired
	CreateAccountService createAccuontService;
	
	@Autowired
	UserCommand command;
	
	@PostMapping("createAccount")
	public String createAccount(UserCommand command) {
		createAccuontService.execute(command);
		return "redirect:/";
	}
	
	@Autowired
	EmailSendService emailSendService;
	
	@Autowired
	EmailCheckService emailCheckService;
	
	@PostMapping("sendEmail")
	public String send(@RequestParam String email) {
		emailCheckService.execute(email);
		return "thymeleaf/signup/signupPage";
	}
}
