package com.example.demo.mapper;



import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.InfoDTO;
import com.example.demo.model.ItemDTO;
import com.example.demo.model.PaymentDTO;

@Mapper
public interface PurchaseMapper {

	public void insert(InfoDTO info);

	public String selectNum();

	public InfoDTO selectOne(String purchaseNum);

	public void insertItem(ItemDTO i);

	public String goodsName(String purchaseNum);

	public void paymentInsert(PaymentDTO dto);

}
