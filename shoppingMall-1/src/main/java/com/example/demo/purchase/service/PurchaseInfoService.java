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
	
	public String execute(PurchaseDTO dto, HttpSession session) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		String memberNum = auth.getUserNum();
		
		//purchaseNum 생성하기
		String purchaseNum = purchaseMapper.selectNum();
		
		List<ItemDTO> items = dto.getItems();
		
		//총 금액
		Integer purchasePrice = 0;
		
		for(ItemDTO i : items) {
			//unit price 합산하여 total price 계산하기
			purchasePrice += i.getUnitPrice();
		}
		
		InfoDTO info = dto.getInfo();
		
		info.setMemberNum(memberNum);
		info.setPurchasePrice(purchasePrice);
		info.setPurchaseNum(purchaseNum);
		
		purchaseMapper.insert(info);
		
		for(ItemDTO i : items) {
			//purchaseNum 추가하기
			i.setPurchaseNum(purchaseNum);
			//구매할 아이템 purchase_list에 추가하기
			purchaseMapper.insertItem(i);
		}
		
		return purchaseNum;
	}
}
