package com.mvp.web.controller;

import org.springframework.stereotype.Controller;

@Controller
public class MvcController {

   /* // '/hello' mapping
    @GetMapping("hello")
    public String hello(Model model) {

        // Get요청시, 스프링 컨테이너가 만들어준 model
        model.addAttribute("data", "그랜절 올립니다!!");

        // return하는 "hello"는 viewResolver에 의해
        // resources/templates/hello.html로 매핑된다.
        return "hello";
    }

    @GetMapping("hello-mvc")
    public String helloMvc(@RequestParam("name") String name, Model model) {
        model.addAttribute("name", name);
        return "hello-template";
    }

    @GetMapping("hello-string")
    @ResponseBody
    public String helloString(@RequestParam("name") String name) {
        return "hello " + name;
    }


    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name){
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }

    static class Hello {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }
*/

}
