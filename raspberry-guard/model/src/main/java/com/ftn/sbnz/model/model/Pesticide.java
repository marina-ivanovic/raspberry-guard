package com.ftn.sbnz.model.model;

public class Pesticide {

    private String tradeName;
    private String activeSubstance;
    private String targetDisease;
    private double recommendedDosage;
    private String dosageUnit;
    private int waitingPeriodDays;
    private String forbiddenPhase;
    private String status;
    private String pesticideType;

    public Pesticide() {}

    public Pesticide(String tradeName, String activeSubstance, String targetDisease,
                     double recommendedDosage, String dosageUnit, int waitingPeriodDays,
                     String forbiddenPhase, String status, String pesticideType) {
        this.tradeName = tradeName;
        this.activeSubstance = activeSubstance;
        this.targetDisease = targetDisease;
        this.recommendedDosage = recommendedDosage;
        this.dosageUnit = dosageUnit;
        this.waitingPeriodDays = waitingPeriodDays;
        this.forbiddenPhase = forbiddenPhase;
        this.status = status;
        this.pesticideType = pesticideType;
    }

    public String getTradeName() { return tradeName; }
    public void setTradeName(String tradeName) { this.tradeName = tradeName; }

    public String getActiveSubstance() { return activeSubstance; }
    public void setActiveSubstance(String activeSubstance) { this.activeSubstance = activeSubstance; }

    public String getTargetDisease() { return targetDisease; }
    public void setTargetDisease(String targetDisease) { this.targetDisease = targetDisease; }

    public double getRecommendedDosage() { return recommendedDosage; }
    public void setRecommendedDosage(double recommendedDosage) { this.recommendedDosage = recommendedDosage; }

    public String getDosageUnit() { return dosageUnit; }
    public void setDosageUnit(String dosageUnit) { this.dosageUnit = dosageUnit; }

    public int getWaitingPeriodDays() { return waitingPeriodDays; }
    public void setWaitingPeriodDays(int waitingPeriodDays) { this.waitingPeriodDays = waitingPeriodDays; }

    public String getForbiddenPhase() { return forbiddenPhase; }
    public void setForbiddenPhase(String forbiddenPhase) { this.forbiddenPhase = forbiddenPhase; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPesticideType() { return pesticideType; }
    public void setPesticideType(String pesticideType) { this.pesticideType = pesticideType; }

    @Override
    public String toString() {
        return "Pesticide{tradeName='" + tradeName + "', target='" + targetDisease
                + "', status='" + status + "'}";
    }
}
