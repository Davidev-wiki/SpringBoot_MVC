package com.mvp.web.service;

import com.mvp.web.domain.Post;
import com.mvp.web.repository.BoardRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedList;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    /* insert */
    public String insertPost(Post post) {
        return boardRepository.insert(post);
    }
    /* 모든 게시물을 select */
    public LinkedList<Post> selectPosts() {
        return boardRepository.selectPosts();
    }

    /* 선택한 하나의 게시물을 select */
    public Post selectOnePost(String bNum) {
        return boardRepository.selectOnePost(bNum);
    }

    /* update */

    /* delete */
}
