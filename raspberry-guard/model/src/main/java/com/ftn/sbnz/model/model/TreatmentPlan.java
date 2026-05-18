package com.ftn.sbnz.model.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TreatmentPlan {

    private Diagnosis diagnosis;
    private List<String> recommendedTreatments;
    private List<String> alerts;
    private Date dateCreated;

    public TreatmentPlan() {
        this.recommendedTreatments = new ArrayList<>();
        this.alerts = new ArrayList<>();
        this.dateCreated = new Date();
    }

    public TreatmentPlan(Diagnosis diagnosis) {
        this.diagnosis = diagnosis;
        this.recommendedTreatments = new ArrayList<>();
        this.alerts = new ArrayList<>();
        this.dateCreated = new Date();
    }

    public Diagnosis getDiagnosis() { return diagnosis; }
    public void setDiagnosis(Diagnosis diagnosis) { this.diagnosis = diagnosis; }

    public List<String> getRecommendedTreatments() { return recommendedTreatments; }
    public void setRecommendedTreatments(List<String> recommendedTreatments) {
        this.recommendedTreatments = recommendedTreatments;
    }
    public void addTreatment(String treatment) { this.recommendedTreatments.add(treatment); }

    public List<String> getAlerts() { return alerts; }
    public void setAlerts(List<String> alerts) { this.alerts = alerts; }
    public void addAlert(String alert) { this.alerts.add(alert); }

    public Date getDateCreated() { return dateCreated; }
    public void setDateCreated(Date dateCreated) { this.dateCreated = dateCreated; }

    @Override
    public String toString() {
        return "TreatmentPlan{\n  diagnosis=" + diagnosis +
               "\n  treatments=" + recommendedTreatments +
               "\n  alerts=" + alerts + "\n}";
    }
}
