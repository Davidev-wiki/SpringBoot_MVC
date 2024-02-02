'use strict';

/* 연결 불가 링크 리스트 */
const DISCONNECT = [
    'https://www.k-startup.go.kr/',
    'https://www.k-startup.go.kr/edu/home/main/index',
    "https://www.motie.go.kr/",
    "https://www.kisa.or.kr/",
    "https://www.nipa.kr/",
    "https://www.kocca.kr/kocca/main.do",
    "https://www.smes.go.kr/sme-expo/site/main/home.do",
    "https://www.campus.co/intl/ko_kr/seoul/",
    "https://dcamp.kr/",
    "https://www.startupall.kr/",
    "http://fundfinder.k-vic.co.kr/rsh/rsh/RshMacFnd",
    "https://www.vcs.go.kr/web/portal/investor/list",
    "https://www.wishket.com/",
    "https://www.freemoa.net/",
    "https://onoffmix.com/",
    "http://startup-wiki.kr"
]

$(document).ready(async function(){
    // 우측 메뉴영역 초기화
    initArea();

    const resultMessage = await requestWeather();
    setWeather("weather", resultMessage);

    /* 좌측 메뉴링크 버튼 클릭 이벤트 */
    const dropdown_links = document.querySelectorAll(".dropdown-item");
    dropdown_links.forEach(function (item) {
        item.addEventListener("click", display);
    });

    function display(event) {

        // 메뉴 타겟 링크 이벤트리스너 세팅
        const link = event.target.href;
        const new_window_yn = DISCONNECT.includes(link); // disconnec에 있는지 여부 체크

        if (new_window_yn) {
            event.target.setAttribute("target", "_blank");
        } else {
            event.preventDefault();
            const $element = document.createElement("embed");

            $element.setAttribute("class", 'embeded-content')
            $element.setAttribute("type", 'text/html');
            $element.setAttribute("src", link);
            const content_area = document.getElementById("contents");

            // 기존에 있던 자식 노드들을 모두 제거
            while (content_area.firstChild) {
                content_area.removeChild(content_area.firstChild);
            }

            content_area.appendChild($element); // 수정된 embed 요소를 삽입
            content_area.style.display = "block";
        }

    }


    /* 우측 유틸영역 버튼 클릭 이벤트*/
    const sideMenuBar = document.querySelectorAll(".page-item");
    sideMenuBar.forEach(function(item){
        item.addEventListener("click", change);
    });

    async function change(event) {

        initArea();

        // ID값으로 메서드 분기
        const theme = event.target.id;
        let resultMessage = "";

        switch (theme) {
            case "weather":
                resultMessage = await requestWeather();
                setWeather(theme, resultMessage);
                break;
            case "map":
                kakao.maps.load(() => {
                    requestMap();
                });
                break;
            case "exchangeRate":
                requestExchangeRate();
                break;
            case "inquiry":
                console.log('Inquiry 진입');
                requestInquiry();
                break;
        }
    }
    /* 우측 유틸영역 초기화 */
    function initArea() {
        $(".sidebar_content").empty();
        $(".inquirySection").hide();
        const newTitle = $("<h3>");
        newTitle.attr("id", "content-title");
        newTitle.text("");
        $(".sidebar_content").append(newTitle);

        const newDiv = $("<div>");
        newDiv.attr("id", "content-wrapper");
        newDiv.css("width", "300px");
        newDiv.css("height", "250px");
        $(".sidebar_content").append(newDiv);

        console.log("영역이 초기화 되었습니다.");
    }

    /* OpenWeatherMap 날씨 요청 메서드 */
    async function requestWeather() {
        console.log("Weather API requested!")
        const key = "23a93b0b3bafbd17bc6bfaa741906d2d";
        const requestLocation = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=${key}`;
        try{
            const result = await fetch(requestLocation)
            const jsonResult = await result.json();

            let locationSet= {};
            locationSet = findLocation(locationSet, jsonResult[0]);

            const resultMessage = await getWeather(locationSet.lat, locationSet.lon, key);
            console.log("resultMessage >>> : " + resultMessage);
            return resultMessage;
        } catch (error) {
            console.error('Error in : requestWeather() >>> : '+ error);
            return "";
        }

    }

    /* 위도 경도 매핑*/
    function findLocation(object, info) {
        object.country = info.country;
        object.city = info.name;
        object.lat = info.lat; // 위도
        object.lon = info.lon; // 경도

        return object;
    }

    /* 날씨 호출 메서드 */
    async function getWeather(lat, lon, key) {
        const requestWeather =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=kr`;
        try{
            const getWeather = await fetch(requestWeather);
            const weatherData = await getWeather.json();

            if (!weatherData) {
                return "날씨를 가져오지 못했어요!";
            }

            const locName = weatherData.name; // 지역명
            const temp_Max = weatherData.main.temp_max; // 최고기온
            const temp_Min = weatherData.main.temp_min; // 최저기온
            const temp = weatherData.main.temp; // 현재기온
            const desciption = weatherData.weather[0].description;

            return `현재 위치는 ${locName} 입니다!<br> 
                 오늘의 최고기온은 ${temp_Max}도,<br> 
                 최저기온은 ${temp_Min}도 입니다!<br>
                 현재 온도는 ${temp} 도 입니다!<br>
                 현재 날씨는 ${desciption} 입니다!`;
        } catch(error) {
            console.log("error in findLocation(object, info) >>> : " + error)
        }
    }

    /* 날씨 정보 세팅 메서드 */
    function setWeather (title, message) {
        $("#content-title").text(title);
        $("#content-wrapper").html(message);
    }

    /* 카카오지도 요청 메서드 */
    function requestMap() {
        /* key : 8bb01530fa66d976bcf0c13b83203cff */
        // 현재의 위도와 경도를 가져온 후 api 호출
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const mapContainer = document.getElementById('content-wrapper'), // 지도를 표시할 div
                mapOption = {
                    center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };
            // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
            new kakao.maps.Map(mapContainer, mapOption);
        });
    }

    /* 한국수출입은행 환율 요청 메서드 */
    async function requestExchangeRate() {

        const url = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/krw.json";
        try {
            const response = await fetch(url);
            let result = await response.json();
            result = getCurrency(result);
            setCurrency(result);
        } catch (error) {
            console.error('자료를 받아오는데 에러가 발생했어요! >>> :', error);
        }

    }

    /* 날짜 포맷 생성 메서드 ex)20240202 */
    /*function getCurrentDate() {
        // 현재 시간과 날짜 객체 생성
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        // 만약 현재 시간이 11시 이전이라면, 이전 날짜로 설정
        if (currentHour < 11) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        // 년, 월, 일을 가져와서 문자열로 조합
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        // 문자열로 조합한 날짜 출력
        const formattedDate = `${year}${month}${day}`;
        console.log(formattedDate);

        return formattedDate;
    }*/

    function getCurrency(result) {
        // 1원 대비 통화가치 (usd, jpy, cny, eur)
        const krwCurrency = result.krw;
        const currency = {};

        const krwToUsd = krwCurrency.usd; // 1원에 해당하는 달러 : 현재 0.75
        const UsdToKrw = 1 / krwToUsd; // 1달러에 해당하는 원 : 현재 1331.1

        const krwToJpy = krwCurrency.jpy; // 1원에 해당하는 엔 :
        const jpyToKrw = 1 / krwToJpy; // 1달러에 해당하는 원 : 현재 1331.1

        const krwToCny = krwCurrency.cny; // 1원에 해당하는 달러 : 현재 0.75
        const cnyToKrw = 1 / krwToCny; // 1달러에 해당하는 원 : 현재 1331.1

        const krwToEur = krwCurrency.eur; // 1원에 해당하는 엔 :
        const eurToKrw = 1 / krwToEur; // 1달러에 해당하는 원 : 현재 1331.1

        currency.usd = UsdToKrw.toFixed(1);
        currency.eur = eurToKrw.toFixed(1);
        currency.cny = cnyToKrw .toFixed(1);
        currency.jpy = (jpyToKrw * 100).toFixed(1);

        return currency;
    }

    function setCurrency(result) {
        const title = "오늘의 환율 정보";
        const message = `10,000원으로 교환한 비율입니다!<br>
        1달러 = ${result.usd} 원<br>
        1유로 = ${result.eur} 원<br>
        100위안 = ${result.cny} 원<br>
        100엔 = ${result.jpy} 원<br>`;

        $("#content-title").text(title);
        $("#content-wrapper").html(message);
    }

    /* 문의사항 보내기 화면 세팅 */
    function requestInquiry(){
        $("#content-wrapper").removeAttr("style");
        const title = "문의하기";
        $(".inquirySection").show();
        $("#content-title").text(title);
    }

    /* 문의 제출 버튼 클릭 이벤트 */
    $("#submit").click(function(){
        alert("보내버렸슈..")
    });

});