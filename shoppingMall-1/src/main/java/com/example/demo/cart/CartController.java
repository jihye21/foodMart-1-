package com.example.demo.cart;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.cart.service.CartAddService;
import com.example.demo.cart.service.CartListService;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.CartDTO;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("cart")
public class CartController {
	
	@Autowired
	CartAddService cartAddService;
	
	@Autowired
	ProductMapper productMapper;
	
	@PostMapping("cartAdd")
	public String cartAdd(
			@RequestParam("goodsName") String goodsName, @RequestParam("cartQty") Integer cartQty, HttpSession session) {
		
		String goodsNum = productMapper.selectGoodsNum(goodsName);
		
		CartDTO dto = new CartDTO();
		
		dto.setGoodsNum(goodsNum);
		dto.setCartQty(cartQty);
		
		cartAddService.execute(session, dto);
		
		return "redirect:/";
	}
	
	@Autowired
	CartListService cartListService;
	
	@PostMapping("cartList")
	public String cartList(
			@RequestParam String goodsName, @RequestParam Integer cartQty
			, HttpSession session) {
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		
		String memberNum = auth.getUserNum();
		
		String goodsNum = productMapper.selectGoodsNum(goodsName);
		
		CartDTO dto = new CartDTO();
		
		dto.setGoodsNum(goodsNum);
		dto.setCartQty(cartQty);
		dto.setMemberNum(memberNum);
		
		cartListService.execute(dto);
		return "redirect:/";
	}
}
