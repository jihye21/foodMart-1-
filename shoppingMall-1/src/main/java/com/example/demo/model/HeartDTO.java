package com.example.demo.model;

import org.apache.ibatis.type.Alias;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Alias("heartDTO")
@Data
public class HeartDTO {
	String memberNum;
	String goodsNum;
	
}
