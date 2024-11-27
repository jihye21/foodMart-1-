package com.example.demo.product.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.productDTO;

@Service
public class ProductListService {
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(Model model) {
		
		List<productDTO> list = new ArrayList<productDTO>();
		
		list = productMapper.productList();
		
		model.addAttribute("list", list);
		
	}
	
}
