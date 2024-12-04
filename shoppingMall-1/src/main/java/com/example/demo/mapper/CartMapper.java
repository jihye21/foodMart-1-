package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.CartDTO;

@Mapper
public interface CartMapper {

	public void cartAdd(CartDTO dto);

	public Integer cartCheck(CartDTO dto);

	public void cartUpdate(CartDTO dto);

	public List<CartDTO> cartList(String memberNum);

	public void updateList(CartDTO dto);
	
}
