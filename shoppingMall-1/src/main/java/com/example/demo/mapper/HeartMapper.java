package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.HeartDTO;

@Mapper
public interface HeartMapper {

	public void heatInsert(HeartDTO dto);

	public List<HeartDTO> selectHeartList(String userNum);

	public void heartDel(HeartDTO dto);
	
}
