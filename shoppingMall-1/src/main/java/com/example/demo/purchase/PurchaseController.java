package com.example.demo.purchase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.model.PurchaseDTO;
import com.example.demo.purchase.service.PurchaseInfoService;
import com.example.demo.purchase.service.iniPayReqService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("purchase")
public class PurchaseController {
	@Autowired
	PurchaseInfoService purchaseInfoService;
	
	@Autowired
	iniPayReqService iniPayReqService;
	
	@PostMapping("info")
	public ResponseEntity<String> info(@RequestBody PurchaseDTO dto, HttpSession session, Model model) {
		String purchaseNum = purchaseInfoService.execute(dto, session);
		
		return ResponseEntity.ok(purchaseNum);
	}
	
	
	@PostMapping("payment")
	public String payment1(@RequestParam String purchaseNum, Model model) {
		iniPayReqService.execute(purchaseNum, model);
		return "redirect:payment";
	}
	
	@GetMapping("payment")
	public String payment(@RequestParam String purchaseNum, Model model) {
		System.out.println(purchaseNum);
		iniPayReqService.execute(purchaseNum, model);
		return "thymeleaf/purchase/payment";
	}
	
}
