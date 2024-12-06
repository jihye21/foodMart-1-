package com.example.demo.model;

import org.apache.ibatis.type.Alias;

import jakarta.mail.search.IntegerComparisonTerm;
import lombok.Data;

@Data
@Alias("infoDTO")
public class InfoDTO {
	///delivery
	String deliveryAddr;
	String deliveryAddrDetail;
	Integer deliveryPost;
	Integer deliveryPhone;
	
	///etc
	String message;
	
	//회원 정보
	String memberNum;


	String purchaseNum;
	//구매자 정보
	String deliveryName;
	Integer purchasePrice;
	String purchaseName;
	
}
