package com.mvp.web;

import com.mvp.web.repository.JdbcMemberRepository;
import com.mvp.web.repository.MemberRepository;
import com.mvp.web.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class SpringConfig {

    private final DataSource dataSource;

    @Autowired
    public SpringConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public MemberService MemberService(){
        return new MemberService(MemberRepository());
    }

    @Bean
    public MemberRepository MemberRepository() {
        return new JdbcMemberRepository(dataSource);
    }


}
