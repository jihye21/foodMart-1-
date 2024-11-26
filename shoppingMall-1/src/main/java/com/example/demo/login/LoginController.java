package com.example.demo.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.login.service.LoginCheckService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("login")
public class LoginController {
	
	@GetMapping("loginPage")
	public String loginPage() {
		return "thymeleaf/login/loginPage";
	}
	
	@Autowired
	LoginCheckService loginCheckService;
	
	@PostMapping("loginCheck")
	public String loginCheck(HttpServletRequest request, HttpSession session,
			Model model,
			@RequestParam String userId, @RequestParam String userPw) {
		loginCheckService.execute(request, session, model, userId, userPw);
		
		return "redirect:/";
	}
	
	@GetMapping("logout")
	public String logout(HttpSession session) {
		session.removeAttribute("auth");
		return "redirect:/";
	}
}	
