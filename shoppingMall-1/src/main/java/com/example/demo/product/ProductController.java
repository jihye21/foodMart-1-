package com.example.demo.product;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("product")
public class ProductController {
	
	@GetMapping("regist")
	public String regist() {
		
		return "thymeleaf/product/regist";
	}
}
