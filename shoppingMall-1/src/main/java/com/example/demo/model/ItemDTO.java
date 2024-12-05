package com.example.demo.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("itemDTO")
public class ItemDTO {
	//구매할 상품
	String goodsNum;
	Integer cartQty;
	Integer unitPrice;
}
