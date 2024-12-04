package com.example.demo.product.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.demo.mapper.HeartMapper;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.HeartDTO;
import com.example.demo.model.productDTO;

import jakarta.servlet.http.HttpSession;

@Service
public class ProductDetailService {
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(String goodsName, Model model, HttpSession session) {
		
		productDTO dto = new productDTO();
		
		dto = productMapper.productDetail(goodsName);
		
		model.addAttribute("dto", dto);
		
		System.out.println(dto);
	}
	
}
