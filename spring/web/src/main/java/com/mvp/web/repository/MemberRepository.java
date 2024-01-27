package com.mvp.web.repository;

import com.mvp.web.domain.Member;

import java.util.List;
import java.util.Optional;

// 함수의 기능을 정의함.
public interface MemberRepository {
    // 멤버를 저장하는 기능.
    Member save(Member member);

    // 아이디로 회원정보를 찾는 기능.
    Optional<Member> findById(Long id);

    // 이름으로 회원정보를 찾는 기능.
    Optional<Member> findByName(String name);

    // 저장된 회원정보를 모두 찾는 기능.
    List<Member> findAll();
}
