
$(document).ready(function(){

    // 글쓰기
    $("#write").click(function(){
        window.open("/form", "_blank", "width=450,height=580");
    });

    // 새 창에서 글 싸기 버튼 클릭 후 서버로 전송
    $("#submitBtn").click(function(){

        // 폼 데이터를 가져옴
        const formData = $("#postForm").serialize();

        // 서버로 POST 요청을 보냄
        $.post("/board/newPost", formData)
            .then(success)
            .catch(failure)
    });

    function success(response){
        alert("게시물이 등록되었습니다!");
        console.log(response);
    }
    function failure(error) {
        alert("게시물 등록중 오류가 발생했습니다.");
        console.log(error);
    }




    // 새 창에서 글 싸기 버튼 클릭 후 서버로 전송
    $(".postElements").click(function(){
        const bNum = $(this).find("#postNum")[0].textContent;

        console.log("bNum >>> : " + bNum);
        if(bNum === undefined) {
            alert("값이 없음");
            return;
        }
        window.open(`/board/readPost?bNum=${bNum}`, "_blank", "width=580,height=500");
    });


});
