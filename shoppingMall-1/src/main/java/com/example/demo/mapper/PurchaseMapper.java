package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.InfoDTO;
import com.example.demo.model.PurchaseDTO;

@Mapper
public interface PurchaseMapper {

	public void insert(InfoDTO info);

	public String selectNum();

	public InfoDTO selectOne(String purchaseNum);

}
