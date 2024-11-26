package com.example.demo.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("auth")
public class AuthInfoDTO {
	String userNum;
	String userId;
}
