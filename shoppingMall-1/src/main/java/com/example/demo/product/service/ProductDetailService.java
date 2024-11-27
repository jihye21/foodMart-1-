package com.example.demo.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.productDTO;

@Service
public class ProductDetailService {
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(String goodsName, Model model) {
		
		productDTO dto = new productDTO();
		
		dto = productMapper.productDetail(goodsName);
		
		model.addAttribute("dto", dto);
	}
	
}
