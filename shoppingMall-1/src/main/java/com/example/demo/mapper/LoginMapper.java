package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.AuthInfoDTO;
import com.example.demo.model.LoginDTO;

@Mapper
public interface LoginMapper {

	public void memberRegist(LoginDTO dto);

	public AuthInfoDTO loginCheck(LoginDTO dto);

}
