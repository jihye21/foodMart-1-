package com.example.demo.heart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.HeartMapper;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.HeartDTO;

import jakarta.servlet.http.HttpSession;

@Service
public class HeartDelService {
	
	@Autowired
	HeartMapper heartMapper;
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(String goodsName, HttpSession session) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		HeartDTO dto = new HeartDTO();
		
		dto.setGoodsNum(productMapper.selectGoodsNum(goodsName));
		dto.setMemberNum(auth.getUserNum());
		
		heartMapper.heartDel(dto);
		
	}

}
