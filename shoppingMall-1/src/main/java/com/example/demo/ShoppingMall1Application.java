package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.model.AuthInfoDTO;

import jakarta.servlet.http.HttpSession;

@SpringBootApplication
@Controller
public class ShoppingMall1Application {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingMall1Application.class, args);
	}
	
	@GetMapping("/")
	public String index(HttpSession session, Model model) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		if(auth != null)
		model.addAttribute("auth", auth);
		
		
		return "thymeleaf/index";
	}
	
	
}
