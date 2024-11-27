package com.example.demo.model;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("productDTO")
public class productDTO {
	String goodsNum;
	String goodsName;
	Integer goodsPrice;
	String goodsContents;
	String goodsMainImage;
	String goodsMainStoreImage;
	String goodsDetailImage;
	String goodsDetailStoreImage;
	
	String empNum;
	Date goodsRegist;
	String updateEmpNum;
	Date goodsUpdateDate;
}
