package com.example.demo.product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.command.ProductCommand;
import com.example.demo.mapper.HeartMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.HeartDTO;
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
	
	@Autowired
	HeartMapper heartMapper;
	
	@GetMapping("detail")
	public String detail(@RequestParam String goodsName, Model model, HttpSession session) {
		
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		if(auth != null)
		{
			model.addAttribute("auth", auth);
			
			List<HeartDTO> list = new ArrayList<HeartDTO>();
			
			list = heartMapper.selectHeartList(auth.getUserNum());
			
			model.addAttribute("heartList", list);
			
		}
		
		
		productDetailService.execute(goodsName, model, session);
		return "thymeleaf/product/detail";
	}
}
