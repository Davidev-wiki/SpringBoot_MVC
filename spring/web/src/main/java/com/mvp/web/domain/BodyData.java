package com.mvp.web.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.List;

public class BodyData {
    @JsonProperty
    private HashMap<String, List<Weather>> items;
    @JsonProperty
    private String dataType;
    @JsonProperty
    private String pageNo;
    @JsonProperty
    private String numOfRows;
    @JsonProperty
    private String totalCount;

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getPageNo() {
        return pageNo;
    }

    public void setPageNo(String pageNo) {
        this.pageNo = pageNo;
    }

    public String getNumOfRows() {
        return numOfRows;
    }

    public void setNumOfRows(String numOfRows) {
        this.numOfRows = numOfRows;
    }

    public String getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(String totalCount) {
        this.totalCount = totalCount;
    }

    public HashMap<String, List<Weather>> getItems() {
        return items;
    }

    public void setItems(HashMap<String, List<Weather>> items) {
        this.items = items;
    }
}
