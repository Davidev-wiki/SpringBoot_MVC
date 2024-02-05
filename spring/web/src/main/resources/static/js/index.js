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

$(document).ready(async function (callback) {

    /* 상단 네비게이션바 버튼 클릭 이벤트*/
    $(".nav-link").click(function(event) {
        // 기존 content 영역 초기화
        $("#contents").empty();

        //
        const nav_id = event.target.id;
        switch (nav_id) {
            case "freeBoard":
                getBoard();
                console.log("freeBoard를 클릭했습니다.");
                break;
            case "mentoChat":
                console.log("mentoChat을 클릭했습니다.");
                break;
            case "roremipsum1":
                console.log("roremipsum1을 클릭했습니다.");
                break;
            case "roremipsum2":
                console.log("roremipsum2를 클릭했습니다.");
                break;
        }
    });

    /* 자유게시판 클릭시 게시판 화면 조회 */
    async function getBoard() {
        try {
            const result = await fetch("/board");
            const boardHtml = await result.text(); // HTML을 텍스트로 추출

            console.log(boardHtml); // 또는 실제로 사용할 데이터의 처리를 여기에 추가
            $("#contents").html(boardHtml);
            console.log("-- getBoard() 종료 --");
        } catch (error) {
            console.error("게시판을 받아오는 중 에러가 발생했어요!", error);
        }
    }




    /* 좌측 메뉴 버튼 클릭 이벤트 */
    const dropdown_links = document.querySelectorAll(".dropdown-item");
    dropdown_links.forEach(function (item) {
        item.addEventListener("click", display);
    });

    /* embeded 화면을 콘텐츠 영역에 표시 */
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


    // 우측 메뉴영역 초기화
    initArea();
    const resultMessage = await requestWeather();
    setWeather("weather", resultMessage);

    /* 우측 유틸영역 버튼 클릭 이벤트*/
    const sideMenuBar = document.querySelectorAll(".page-item");
    sideMenuBar.forEach(function (item) {
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
            case "memo":
                requestMemo();
                break;
            case "inquiry":
                requestInquiry();
                break;
        }
    }

    /* 우측 유틸영역 초기화 */
    function initArea() {
        $(".sidebar_content").empty();
        const newTitle = $("<h3>");
        newTitle.attr("id", "content-title");
        newTitle.text("");
        $(".sidebar_content").append(newTitle);

        const newDiv = $("<div>");
        newDiv.attr("id", "content-wrapper");
        newDiv.css("width", "300px");
        newDiv.css("height", "250px");
        $(".sidebar_content").append(newDiv);

        $(".inquirySection").hide();
        $(".memoryNote").hide();
        $("#noteList").empty();

    }

    /* OpenWeatherMap 날씨 요청 메서드 */
    async function requestWeather() {
        const key = "23a93b0b3bafbd17bc6bfaa741906d2d";
        const requestLocation = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=${key}`;
        try {
            const result = await fetch(requestLocation)
            const jsonResult = await result.json();

            let locationSet = {};
            locationSet = findLocation(locationSet, jsonResult[0]);

            const resultMessage = await getWeather(locationSet.lat, locationSet.lon, key);
            return resultMessage;
        } catch (error) {
            console.error('Error in : requestWeather() >>> : ' + error);
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
        try {
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
        } catch (error) {
            console.log("error in findLocation(object, info) >>> : " + error)
        }
    }

    /* 날씨 정보 세팅 메서드 */
    function setWeather(title, message) {
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
            const map = new kakao.maps.Map(mapContainer, mapOption);

            // 지도 타입 변경 컨트롤을 생성한다
            const mapTypeControl = new kakao.maps.MapTypeControl();

            // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
            map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

            // 지도에 확대 축소 컨트롤을 생성한다
            const zoomControl = new kakao.maps.ZoomControl();

            // 지도의 우측에 확대 축소 컨트롤을 추가한다
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            // 지도에 마커를 생성하고 표시한다
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(37.56406, 126.99810), // 마커의 좌표
                draggable : true, // 마커를 드래그 가능하도록 설정한다
                map: map // 마커를 표시할 지도 객체
            });

            // 마커에 dragstart 이벤트 등록
            kakao.maps.event.addEventListener(marker, 'dragstart', function () {
                console.log('마커에 dragstart 이벤트가 발생했습니다!');
            });

            // 마커에 dragend 이벤트 등록
            kakao.maps.event.addEventListener(marker, 'dragend', function() {
                console.log('마커에 dragend 이벤트가 발생했습니다!');
            });

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
        currency.cny = cnyToKrw.toFixed(1);
        currency.jpy = (jpyToKrw * 100).toFixed(1);

        return currency;
    }

    function setCurrency(result) {
        const title = "오늘의 환율 정보";
        const message = `
        1달러 = ${result.usd} 원<br>
        1유로 = ${result.eur} 원<br>
        100위안 = ${result.cny} 원<br>
        100엔 = ${result.jpy} 원<br>`;

        $("#content-title").text(title);
        $("#content-wrapper").html(message);
    }

    function requestMemo() {
        $("#content-wrapper").removeAttr("style");
        $(".side_contents").show();
        $(".inquirySection").hide(); // 문의하기 숨김

        const title = "메모리노트";
        $("#content-title").text(title);

        const note = localStorage.getItem("note");
        $("#noteList").append($("<li>").text(note));
    }

    $("#save").click(function(){
        localStorage.setItem("note", $("#memoryNote").val());
        $("#memoryNote").val('').focus();
        requestMemo();
    });

    $("#remove").click(function(){
        localStorage.setItem("note", "");
        $("#noteList").empty();
        $("#memoryNote").val('').focus();
    });

    /* 문의사항 보내기 화면 세팅 */
    function requestInquiry() {
        $("#content-wrapper").removeAttr("style");
        $(".side_contents").show();
        $(".memoryNote").hide(); // 메모리노트 숨김

        const title = "문의하기";
        $("#content-title").text(title);
    }

    /* 문의 제출 버튼 클릭 이벤트 */
    $("#submit").click(function () {
        alert("보내버렸슈..")
    });

});