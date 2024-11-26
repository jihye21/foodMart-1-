package com.example.demo.model;



import org.apache.ibatis.type.Alias;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Alias("loginDTO")
@Data
public class LoginDTO {
	String userId;
	String userPw;
	String userName;
	String userAddr;
	String userAddrDetail;
	String userPost;
	Number userPhone;
	String userEmail;
}	
