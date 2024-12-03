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
	
	@Autowired
	HeartMapper heartMapper;
	
	public void execute(String goodsName, Model model, HttpSession session) {
		
		productDTO dto = new productDTO();
		
		dto = productMapper.productDetail(goodsName);
		
		model.addAttribute("dto", dto);
		
		//로그인 session 저장
			AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
			
			if(auth != null)
			{
				model.addAttribute("auth", auth);
				
				List<HeartDTO> list = new ArrayList<HeartDTO>();
				
				list = heartMapper.selectHeartList(auth.getUserNum());
				
				model.addAttribute("heartList", list);
			}
	}
	
}
