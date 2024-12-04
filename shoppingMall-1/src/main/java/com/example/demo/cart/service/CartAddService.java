package com.example.demo.cart.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.CartMapper;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.CartDTO;

import jakarta.servlet.http.HttpSession;

@Service
public class CartAddService {
	
	@Autowired
	CartMapper cartMapper;
	
	public void execute(HttpSession session, CartDTO dto) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		String memberNum = auth.getUserNum();
		
		dto.setMemberNum(memberNum);
		
		System.out.println(dto);
		
		Integer i = 0;
		i = cartMapper.cartCheck(dto);
		
		System.out.println(i);
		
		if(i == 1) {
			cartMapper.cartUpdate(dto);
		}
		else {
			cartMapper.cartAdd(dto);
		}
		
	}
	
}
