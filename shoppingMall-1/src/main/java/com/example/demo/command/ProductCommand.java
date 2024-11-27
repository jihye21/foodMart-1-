package com.example.demo.command;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Component
@Data
public class ProductCommand {
	String goodsName;
	Integer goodsPrice;
	String goodsContents;
	MultipartFile goodsMainImage;
	MultipartFile goodsMainStoreImage;
	MultipartFile goodsDetailImage;
	MultipartFile goodsDetailStoreImage;
}
