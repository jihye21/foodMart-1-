package com.example.demo.product.service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.UUID;

import javax.swing.plaf.synth.Region;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.command.ProductCommand;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.productDTO;

import jakarta.servlet.http.HttpSession;

@Service
public class ProductRegistService {
	
	@Autowired
	ProductMapper productMapper;
	
	public void execute(ProductCommand command, HttpSession session) {
		productDTO dto = new productDTO();
		
		//goodsNum 넘버링
		
		dto.setGoodsName(command.getGoodsName());
		dto.setGoodsPrice(command.getGoodsPrice());
		dto.setGoodsContents(command.getGoodsContents());
		
		//이미지 추가
		URL resource = getClass().getClassLoader().getResource("static/upload");
		String fileDir = resource.getFile();
		
		MultipartFile mf = command.getGoodsMainImage();
		String originalFile = mf.getOriginalFilename();
		String extension = originalFile.substring(originalFile.lastIndexOf("."));
		
		String storeName = UUID.randomUUID().toString().replace("-", "");
		String storeFileName = storeName + extension;
		
		File file = new File(fileDir + "/" + storeFileName);
		
		try {
			mf.transferTo(file);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		dto.setGoodsMainImage(originalFile);
		dto.setGoodsMainStoreImage(storeFileName);
		
		mf = command.getGoodsDetailImage();
		originalFile = mf.getOriginalFilename();
		extension = originalFile.substring(originalFile.lastIndexOf("."));
		
		storeName = UUID.randomUUID().toString().replace("-", "");
		storeFileName = storeName + extension;
		
		file = new File(fileDir + "/" + storeFileName);
		
		try {
			mf.transferTo(file);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		dto.setGoodsDetailImage(originalFile);
		dto.setGoodsDetailStoreImage(storeFileName);
		//
		
		AuthInfoDTO auth = (AuthInfoDTO) session.getAttribute("auth");
		String empNum = auth.getUserNum();
		
		dto.setEmpNum(empNum);
		System.out.println("productRegistService: " + dto);
		
		productMapper.regist(dto);
	}
	
}
