package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.model.AuthInfoDTO;
import com.example.demo.product.service.ProductListService;

import jakarta.servlet.http.HttpSession;

@SpringBootApplication
@Controller
public class ShoppingMall1Application {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingMall1Application.class, args);
	}
	
	@Autowired
	ProductListService productListService;
	
	@GetMapping("/")
	public String index(HttpSession session, Model model) {
		
		//로그인 session 저장
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		if(auth != null)
		model.addAttribute("auth", auth);
		
		//상품 리스트 값 받아오기
		productListService.execute(model);
		
		return "thymeleaf/index";
	}
	
	
}
