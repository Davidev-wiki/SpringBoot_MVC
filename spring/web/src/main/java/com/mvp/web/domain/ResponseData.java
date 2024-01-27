package com.mvp.web.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResponseData {
    @JsonProperty("header")
    private HeaderData header;
    @JsonProperty("body")
    private BodyData body;

    public HeaderData getHeader() {
        return header;
    }

    public void setHeader(HeaderData header) {
        this.header = header;
    }

    public BodyData getBody() {
        return body;
    }

    public void setBody(BodyData body) {
        this.body = body;
    }

}