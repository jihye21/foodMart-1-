package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.productDTO;

@Mapper
public interface ProductMapper {

	public void regist(productDTO dto);

	public List<productDTO> productList();

	public productDTO productDetail(String goodsName);

	public String selectGoodsNum(String goodsName);

}
