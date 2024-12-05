package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.InfoDTO;

@Mapper
public interface PurchaseMapper {

	public void insert(InfoDTO info);

}
