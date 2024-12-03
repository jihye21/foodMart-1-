package com.example.demo.heart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.heart.service.HeartAddService;
import com.example.demo.heart.service.HeartDelService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("heart")
public class HeartListController {
	@Autowired
	HeartAddService heartAddService;
	
	@Autowired
	HeartDelService heartDelService;
	
	@PostMapping("heartAdd")
	public String heartAdd(@RequestParam String goodsName, HttpSession session) {
		heartAddService.execute(goodsName, session);
		return "redirect:/";
	}
	
	@PostMapping("heartDel")
	public String heartDel(@RequestParam String goodsName, HttpSession session) {
		heartDelService.execute(goodsName, session);
		return "redirect:/";
	}
}	
