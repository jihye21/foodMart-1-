package com.example.demo.model;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("purchaseDTO")
public class PurchaseDTO {
	private List<ItemDTO> items;
	private InfoDTO info;
	
}
