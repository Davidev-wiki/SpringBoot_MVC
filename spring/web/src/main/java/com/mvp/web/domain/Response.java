package com.mvp.web.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Response {
    @JsonProperty("response")
    private ResponseData responseData;

    public ResponseData getResponseData() {
        return responseData;
    }

    public void setResponseData(ResponseData responseData) {
        this.responseData = responseData;
    }
}
