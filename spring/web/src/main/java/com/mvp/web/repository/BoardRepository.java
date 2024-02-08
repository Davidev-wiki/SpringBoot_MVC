package com.mvp.web.repository;

import com.mvp.web.domain.Post;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.LinkedList;

@Repository
public class BoardRepository {

    /* ISUD 쿼리문 */
    private String insertSql = "insert into posts(bnum, title, content, writer, regDate) values (POST_SEQ.NEXTVAL, ?, ?, ?, SYSDATE)";
    private String selectAllSql = "select bnum, title, writer, regdate, views, good from posts";
    private String selectOneSql = "select bnum, title, content, writer, regdate, views, good from posts where bnum = ?";

    private String updateSql = "update posts set title = ?, content= ? where bnum = ?";
    private String deleteSql = "delete from posts where bnum = ?";

    private final DataSource dataSource;
    public BoardRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Connection getConnection() {
        return DataSourceUtils.getConnection(dataSource);
    }

    @Transactional
    public String insert(Post post) {

        try (Connection conn = dataSource.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
            pstmt.setString(1, post.getTitle());
            pstmt.setString(2, post.getContent());
            pstmt.setString(3, post.getWriter());

            int result = pstmt.executeUpdate();

            return "게시물 " + result + "행이 성공적으로 삽입되었습니다.";

        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    public LinkedList<Post> selectPosts() {

        LinkedList<Post> postList = new LinkedList();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(selectAllSql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Post post = new Post();
                post.setbNum(rs.getString("BNUM"));
                post.setTitle(rs.getString("TITLE"));
                post.setWriter(rs.getString("WRITER"));
                post.setRegDate(rs.getString("REGDATE"));
                post.setViews(rs.getString("VIEWS"));
                post.setGood(rs.getString("GOOD"));

                postList.add(post);
            }

        } catch (Exception e) {
            throw new IllegalStateException(e);
        }

        return postList;
    }


    public Post selectOnePost(String bNum) {

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(selectOneSql)) {

            pstmt.setString(1, bNum);
            ResultSet rs = pstmt.executeQuery();

            Post post = new Post();
            while(rs.next()) {
                post.setbNum(rs.getString("BNUM"));
                post.setTitle(rs.getString("TITLE"));
                post.setWriter(rs.getString("WRITER"));
                post.setContent(rs.getString("CONTENT"));
                post.setRegDate(rs.getString("REGDATE"));
                post.setViews(rs.getString("VIEWS"));
                post.setGood(rs.getString("GOOD"));
            }
            System.out.println("조회된 글 >>> : " + post.getTitle());

            return post;

        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

}