package com.example.demo.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.demo.mapper.LoginMapper;
import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.LoginDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class LoginCheckService {

	@Autowired
	LoginMapper loginMapper;
	
	public void execute(HttpServletRequest request, HttpSession session, Model model, 
			String userId, String userPw) {
		LoginDTO dto = new LoginDTO();
		dto.setUserId(userId);
		dto.setUserPw(userPw);
		
		AuthInfoDTO auth = new AuthInfoDTO();
		
		auth = loginMapper.loginCheck(dto);
		
		if(auth != null) {
			session = request.getSession();
			session.setAttribute("auth", auth);
		}
		
	}
	
}
