package com.mvp.web.controller;

import com.mvp.web.service.OpenApiRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Controller
public class HomeController {
    private final OpenApiRequest openApiRequest;

    @Autowired
    public HomeController(OpenApiRequest openApiRequest) {
        this.openApiRequest = openApiRequest;
    }

    @GetMapping("/")
    public String home() {
        // 뷰의 이름을 반환
        return "home/index";
    }

    @GetMapping("/weather")
    public String getWeather (Model model) {
        // 현재 날짜와 시간
        LocalDateTime currentDateTime = LocalDateTime.now();

        // 날짜 포맷 지정
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd HH:mm");
        String formattedDate = currentDateTime.format(formatter).substring(0, 8);

        // 시간을 4자리 숫자로 가져오기
        int currentHour = currentDateTime.getHour();
        String time = getString(currentDateTime, currentHour);
        int nx = 58;
        int ny = 126;
        // 결과 출력
        System.out.println("Current Time: " + formattedDate);
        System.out.println("Closest Forecast Time: " + time);

        HashMap resultMap = openApiRequest.fetchData(formattedDate, time, nx, ny);
        model.addAttribute("weather", resultMap);
        System.out.println("weather resultMap : " + resultMap);
        return "home/index";
    }

    private static String getString(LocalDateTime currentDateTime, int currentHour) {
        int currentMinute = currentDateTime.getMinute();
        int currentTime = currentHour * 100 + currentMinute;

        // 단기예보는 1일 8회 제공.
        List<String> timeList = Arrays.asList("0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300");

        // 초기화할 시간 변수
        String time = "";

        // 최소 차이값 초기화
        int minDifference = Integer.MAX_VALUE;

        // 현재 시간과 가장 가까운 시간 찾기
        for (String forecastTime : timeList) {
            int forecastHour = Integer.parseInt(forecastTime.substring(0, 2));
            int forecastMinute = Integer.parseInt(forecastTime.substring(2));
            int forecastTimeValue = forecastHour * 100 + forecastMinute;

            // 현재 시간과의 차이 계산
            int difference = Math.abs(currentTime - forecastTimeValue);

            // 최소 차이값 갱신 및 시간 변수 초기화
            if (difference < minDifference) {
                minDifference = difference;
                time = forecastTime;
            }
        }
        return time;
    }
}
