package com.example.demo.purchase.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.ProductMapper;
import com.example.demo.mapper.PurchaseMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.InfoDTO;
import com.example.demo.model.ItemDTO;
import com.example.demo.model.PurchaseDTO;
import com.mysql.cj.Session;

import jakarta.servlet.http.HttpSession;


@Service
public class PurchaseInfoService {
	
	@Autowired
	PurchaseMapper purchaseMapper;
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(PurchaseDTO dto, HttpSession session) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		String memberNum = auth.getUserNum();
		
		List<ItemDTO> items = dto.getItems();
		
		Integer purchasePrice = 0;
		
		for(ItemDTO i : items) {
			purchasePrice += i.getUnitPrice();
		}
		
		InfoDTO info = dto.getInfo();
		
		info.setPurchaseName(memberNum);
		info.setPurchasePrice(purchasePrice);
		
		purchaseMapper.insert(info);
		
	}
}
