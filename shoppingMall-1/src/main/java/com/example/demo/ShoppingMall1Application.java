package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.mapper.CartMapper;
import com.example.demo.mapper.HeartMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.CartDTO;
import com.example.demo.model.HeartDTO;
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
	
	
	@Autowired
	HeartMapper heartMapper;
	
	@Autowired
	CartMapper cartMapper;
	
	@GetMapping("/")
	public String index(HttpSession session, Model model) {
		
		//로그인 session 저장
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		if(auth != null)
		{
			//로그인 정보 가져오기
			model.addAttribute("auth", auth);
			String memberNum = auth.getUserNum();
			
			//heart list 가져오기
			List<HeartDTO> list = new ArrayList<HeartDTO>();
			list = heartMapper.selectHeartList(memberNum);
			model.addAttribute("heartList", list);
			
			//cart list 가져오기
			List<CartDTO> cartList = new ArrayList<CartDTO>();
			cartList = cartMapper.cartList(memberNum);
			model.addAttribute("cartList", cartList);
		}
		
		//product list 가져오기
		productListService.execute(model);
		
		return "thymeleaf/index";
	}
	
	
}
