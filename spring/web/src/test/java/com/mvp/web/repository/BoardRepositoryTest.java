package com.mvp.web.repository;

import com.mvp.web.domain.Post;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.LinkedList;

class BoardRepositoryTest {

    private final String selectSql = "select * from posts";


    private DataSource dataSource;

    /*
    *
    * spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.datasource.username=system
spring.datasource.password=1111
    * */
    @BeforeEach
    void setUp() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setUrl("jdbc:oracle:thin:@localhost:1521:XE");
        driverManagerDataSource.setDriverClassName("oracle.jdbc.OracleDriver");
        driverManagerDataSource.setUsername("system");
        driverManagerDataSource.setPassword("1111");
        dataSource = driverManagerDataSource;
    }


    private Connection getConnection() {
        return DataSourceUtils.getConnection(dataSource);
    }

    @Test
    void insert() {

        Post post = new Post();
        post.setWriter("김작가");
        post.setTitle("김작가는 누굴까?");
        post.setContent("김작가는 사실... 김찬기다..!");

        String sql = "insert into posts(bnum, title, content, writer, regDate) " +
                "values (POST_SEQ.NEXTVAL, ?, ?, ?, SYSDATE)";
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, post.getTitle());
            pstmt.setString(2, post.getContent());
            pstmt.setString(3, post.getWriter());

            pstmt.executeUpdate();
            System.out.println("게시물이 성공적으로 삽입되었습니다.");

        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Test
    void selectPosts() {
        LinkedList<Post> postList = new LinkedList();

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(selectSql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Post post = new Post();
                post.setbNum(rs.getString("BNUM"));
                post.setTitle(rs.getString("TITLE"));
                post.setContent(rs.getString("CONTENT"));
                post.setWriter(rs.getString("WRITER"));
                post.setRegDate(rs.getString("REGDATE"));
                post.setViews(rs.getString("VIEWS"));
                post.setGood(rs.getString("GOOD"));

                postList.add(post);
                System.out.println("번호 >>> : " + post.getbNum());
                System.out.println("제목 >>> : " + post.getTitle());
                System.out.println("내용 >>> : " + post.getContent());
                System.out.println("작성자 >>> : " + post.getWriter());
                System.out.println("작성일 >>> : " + post.getRegDate());
                System.out.println("조회수 >>> : " + post.getViews());
                System.out.println("좋아요 >>> : " + post.getGood());
            }

        } catch (Exception e) {
            throw new IllegalStateException(e);
        }

    }

}