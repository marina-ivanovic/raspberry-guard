package com.ftn.sbnz.model.model;

import com.ftn.sbnz.model.enums.PathogenType;

public class DiseaseCandidate {

    private String issueName;
    private PathogenType type;
    private int score; // typically 1

    public DiseaseCandidate() {}

    public DiseaseCandidate(String issueName, PathogenType type, int score) {
        this.issueName = issueName;
        this.type = type;
        this.score = score;
    }

    public String getIssueName() { return issueName; }
    public void setIssueName(String issueName) { this.issueName = issueName; }

    public PathogenType getType() { return type; }
    public void setType(PathogenType type) { this.type = type; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    @Override
    public String toString() {
        return "DiseaseCandidate{issueName='" + issueName + "', type=" + type + ", score=" + score + "}";
    }
}
