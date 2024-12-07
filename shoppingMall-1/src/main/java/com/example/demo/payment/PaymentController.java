package com.example.demo.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.payment.service.INIstdpayPcReturn;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("payment")
public class PaymentController {
	@Autowired
	INIstdpayPcReturn iniPayReturnService;
	@RequestMapping("INIstdpay_pc_return")
	public String payReturn (HttpServletRequest request) {
		iniPayReturnService.execute(request);
		return "redirect:/";
	}
	
	@RequestMapping("close")
	public String close() {
		return "thymeleaf/purchase/close";
	}
}
