package com.example.demo.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.command.ProductCommand;
import com.example.demo.product.service.ProductDetailService;
import com.example.demo.product.service.ProductRegistService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("product")
public class ProductController {
	
	@GetMapping("regist")
	public String regist() {
		return "thymeleaf/product/regist";
	}
	
	@Autowired
	ProductRegistService productRegistService;
	
	@Autowired
	ProductCommand productCommand;
	
	@PostMapping("regist")
	public String regist(ProductCommand productCommand, HttpSession session) {
		productRegistService.execute(productCommand, session);
		return "redirect:/";
	}
	
	@Autowired
	ProductDetailService productDetailService;
	
	@GetMapping("detail")
	public String detail(@RequestParam String goodsName, Model model) {
		productDetailService.execute(goodsName, model);
		return "thymeleaf/product/detail";
	}
}
