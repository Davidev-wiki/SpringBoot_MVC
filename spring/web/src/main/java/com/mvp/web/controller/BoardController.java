package com.mvp.web.controller;

import com.mvp.web.domain.Post;
import com.mvp.web.service.BoardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.LinkedList;

@Controller
public class BoardController {
    private final BoardService boardService;
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    /* 모든 게시물 가져오기 (완료) */
    @GetMapping("/board")
    public String getBoard(Model model) {
        LinkedList<Post> posts = boardService.selectPosts();
        model.addAttribute("posts", posts);
        return "board/board";
    }

    /* 글 작성 화면연결 (완료) */
    @GetMapping("/form")
    public String goBoardForm() {
        return "board/boardForm";
    }


    /* 게시물 서버로 전송 */
    @PostMapping("/board/newPost")
    public String sendForm(BoardForm boardForm) {
        Post post = new Post();
        post.setTitle(boardForm.getTitle());
        post.setContent(boardForm.getContent());
        post.setWriter(boardForm.getWriter());

        String result = boardService.insertPost(post);
        System.out.println(result);
        return "board/boardForm";
    }

    /* 게시물 읽기 화면연결 (진행중) */
    @GetMapping("/board/readPost")
    public String readPost(@RequestParam("bNum") String bNum, Model model) {
        Post post = boardService.selectOnePost(bNum);
        model.addAttribute("post", post);
        return "/board/readPost";
    }

}
