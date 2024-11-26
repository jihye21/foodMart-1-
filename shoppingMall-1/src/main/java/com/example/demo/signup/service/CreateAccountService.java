package com.example.demo.signup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.example.demo.command.UserCommand;
import com.example.demo.mapper.LoginMapper;
import com.example.demo.model.LoginDTO;

@Service
public class CreateAccountService {
	@Autowired
	LoginMapper loginMapper;
	
	@Autowired
	LoginDTO loginDTO;
	
	public void execute(UserCommand command) {
		LoginDTO dto = new LoginDTO();
		dto.setUserId(command.getId());
		dto.setUserPw(command.getPassword());
		dto.setUserName(command.getName());
		dto.setUserAddrDetail(command.getAddrDetail());
		dto.setUserPost(command.getPost());
		dto.setUserPhone(command.getPhone());
		
		loginMapper.memberRegist(dto);
	}
	
}
