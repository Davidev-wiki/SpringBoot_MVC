package com.mvp.web.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;

// OpenApiService.java
@Service
public interface OpenApiRequest {
    HashMap fetchData(String baseDate, String baseTime, int nx, int ny);

}