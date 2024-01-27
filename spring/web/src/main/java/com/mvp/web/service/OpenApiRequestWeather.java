package com.mvp.web.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mvp.web.domain.Response;
import com.mvp.web.domain.Weather;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenApiRequestWeather implements OpenApiRequest {

    //    private final String baseUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

    @Override
    public HashMap fetchData(String baseDate, String baseTime, int nx, int ny) {
        System.out.println("baseDate : " + baseDate);
        System.out.println("baseTime : " + baseTime);
        System.out.println("nx : " + nx);
        System.out.println("ny : " + ny);

        String baseUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
        // 본인의 실제 인증키로 교체해야 함
        String serviceKey = "HknGBOw1DcB/tok7KL1O3Azqv7HIbxaFAU1xrbosndCUbf0wS1DtyKgiwwaL5RR7zlKoss8sRxGcJWDMbj2okA==";
        String apiUrl = baseUrl + "?serviceKey=" + serviceKey
                + "&numOfRows=50&pageNo=1&dataType=JSON"
                + "&base_date=" + baseDate
                + "&base_time=" + baseTime
                + "&nx=" + nx
                + "&ny=" + ny;

        System.out.println("apiUrl : " + apiUrl);

        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(apiUrl, String.class);

        // 여기에서 jsonResponse를 원하는 형태로 파싱하여 ResponseData 객체로 변환
        Response response = parseJsonToResponse(jsonResponse);

        // 다른 필요한 데이터에 대한 출력 또는 로직 추가
        HashMap weatherData = response.getResponseData().getBody().getItems();
        List<Weather> weatherList = (List<Weather>) weatherData.get("item");

        String base_Date = weatherList.get(0).getBaseDate();
        String base_Time = weatherList.get(0).getBaseTime();
        String forecastDate = weatherList.get(0).getFcstDate();
        String forecastTime = weatherList.get(0).getFcstTime();

        System.out.println("Base Date: " + base_Date);
        System.out.println("Base Time: " + base_Time);
        System.out.println("Forecast Date: " + forecastDate);
        System.out.println("Forecast Time: " + forecastTime);
        System.out.println();

        HashMap weatherMap = new HashMap();

        weatherMap.put("날짜", base_Date);
        weatherMap.put("base_Time", base_Time);
        weatherMap.put("forecastDate", forecastDate);
        weatherMap.put("forecastTime", forecastTime);


        for (Weather weather : weatherList) {
            if (baseTime.equals(base_Time)) {
                System.out.println("Category: " + weather.getCategory());
                System.out.println("Forecast Value: " + weather.getFcstValue());
                System.out.println("-----");

                // 하늘 상태(SKY) 처리
                if ("SKY".equals(weather.getCategory())) {
                    String skyStatus;
                    switch (weather.getFcstValue()) {
                        case "1":
                            skyStatus = "맑음";
                            break;
                        case "3":
                            skyStatus = "구름많음";
                            break;
                        case "4":
                            skyStatus = "흐림";
                            break;
                        default:
                            skyStatus = "알 수 없음";
                    }
                    weatherMap.put("하늘상태", skyStatus);
                }

                // 강수 형태(PTY) 처리
                if ("PTY".equals(weather.getCategory())) {
                    String precipitationType = switch (weather.getFcstValue()) {
                        case "1" -> "비";
                        case "2" -> "비/눈";
                        case "3" -> "눈";
                        case "4" -> "소나기";
                        default -> "알 수 없음";
                    };
                    weatherMap.put("강수형태", precipitationType);
                }

                // 적설량(SNO) 처리
                if ("SNO".equals(weather.getCategory())) {
                    weatherMap.put("적설", weather.getFcstValue());
                }

                // 강수량(PCP) 처리
                if ("PCP".equals(weather.getCategory())) {
                    weatherMap.put("강수량", weather.getFcstValue());
                }

                if (!weather.getCategory().equals("PCP") && !weather.getCategory().equals("SNO")
                  &&!weather.getCategory().equals("PTY") && !weather.getCategory().equals("SKY")){
                    weatherMap.put(weather.getCategory(), weather.getFcstValue());
                }
            }
        }


        return weatherMap;
    }

    private Response parseJsonToResponse(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // JSON을 ResponseData 객체로 매핑
            return objectMapper.readValue(jsonResponse, Response.class);
        } catch (Exception e) {
            e.printStackTrace();
            // 예외 처리: 파싱 실패 시 null 반환 또는 예외 처리 로직 추가
            return null;
        }
    }

    private Weather createWeatherObject(Map<String, Object> item) {
        Weather weather = new Weather();

        weather.setCategory((String) item.get("category"));
        weather.setFcstDate((String) item.get("fcstDate"));
        weather.setFcstTime((String) item.get("fcstTime"));
        weather.setFcstValue((String) item.get("fcstValue"));
        weather.setNx((int) item.get("nx"));
        weather.setNy((int) item.get("ny"));

        // 나머지 필드들도 유사하게 설정

        return weather;
    }


}
