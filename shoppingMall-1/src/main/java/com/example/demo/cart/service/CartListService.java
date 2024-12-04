package com.example.demo.cart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.CartMapper;
import com.example.demo.model.CartDTO;

@Service
public class CartListService {

	@Autowired
	CartMapper cartMapper;
	
	public void execute(CartDTO dto) {
		cartMapper.updateList(dto);
	}
	
}
