package com.example.demo.purchase;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.model.InfoDTO;
import com.example.demo.model.ItemDTO;
import com.example.demo.model.PurchaseDTO;
import com.example.demo.purchase.service.PurchaseInfoService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("purchase")
public class PurchaseController {
	@Autowired
	PurchaseInfoService purchaseInfoService;
	
	@PostMapping("info")
	public String info(@RequestBody PurchaseDTO dto, HttpSession session) {
		purchaseInfoService.execute(dto, session);
		return "redirect:/";
	}
	
}
