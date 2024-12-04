package com.example.demo.model;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("cartDTO")
public class CartDTO {
	String memberNum;
	String goodsNum;
	String goodsName;
	Date cartDate;
	Integer cartQty;
	String CartNum;
	Integer goodsPrice;
}
