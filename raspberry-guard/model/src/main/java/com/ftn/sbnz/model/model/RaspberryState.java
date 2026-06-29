package com.ftn.sbnz.model.model;

import com.ftn.sbnz.model.enums.GrowthPhase;
import com.ftn.sbnz.model.enums.Variety;

import java.util.ArrayList;
import java.util.List;

public class RaspberryState {

    private Variety variety;
    private GrowthPhase currentPhase;
    private int plotAge;
    private String location;
    private List<Symptom> symptoms;

    public RaspberryState() {
        this.symptoms = new ArrayList<>();
    }

    public RaspberryState(Variety variety, GrowthPhase currentPhase, int plotAge, String location) {
        this.variety = variety;
        this.currentPhase = currentPhase;
        this.plotAge = plotAge;
        this.location = location;
        this.symptoms = new ArrayList<>();
    }

    public Variety getVariety() { return variety; }
    public void setVariety(Variety variety) { this.variety = variety; }

    public GrowthPhase getCurrentPhase() { return currentPhase; }
    public void setCurrentPhase(GrowthPhase currentPhase) { this.currentPhase = currentPhase; }

    public int getPlotAge() { return plotAge; }
    public void setPlotAge(int plotAge) { this.plotAge = plotAge; }

    public List<Symptom> getSymptoms() { return symptoms; }
    public void setSymptoms(List<Symptom> symptoms) { this.symptoms = symptoms; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public void addSymptom(Symptom symptom) {
        this.symptoms.add(symptom);
    }

    @Override
    public String toString() {
        return "RaspberryState{variety=" + variety + ", phase=" + currentPhase +
               ", plotAge=" + plotAge + ", location=" + location + ", symptoms=" + symptoms + "}";
    }
}
