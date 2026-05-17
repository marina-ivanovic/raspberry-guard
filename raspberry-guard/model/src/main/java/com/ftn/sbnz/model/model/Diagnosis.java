package com.ftn.sbnz.model.model;

import java.util.Date;

import com.ftn.sbnz.model.enums.PathogenType;

public class Diagnosis {

    private String issueName;
    private PathogenType type;
    private double certainty; // 0.0 - 1.0
    private Date timestamp;

    public Diagnosis() {
        this.timestamp = new Date();
    }

    public Diagnosis(String issueName, PathogenType type, double certainty) {
        this.issueName = issueName;
        this.type = type;
        this.certainty = certainty;
        this.timestamp = new Date();
    }

    public String getIssueName() { return issueName; }
    public void setIssueName(String issueName) { this.issueName = issueName; }

    public PathogenType getType() { return type; }
    public void setType(PathogenType type) { this.type = type; }

    public double getCertainty() { return certainty; }
    public void setCertainty(double certainty) { this.certainty = certainty; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "Diagnosis{issueName='" + issueName + "', type=" + type +
               ", certainty=" + certainty + "}";
    }
}
