package com.ftn.sbnz.model.model;

import com.ftn.sbnz.model.enums.SymptomLocation;

public class Symptom {

    private String name;
    private SymptomLocation location;
    private int intensity; // 1-10

    public Symptom() {}

    public Symptom(String name, SymptomLocation location, int intensity) {
        this.name = name;
        this.location = location;
        this.intensity = intensity;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SymptomLocation getLocation() { return location; }
    public void setLocation(SymptomLocation location) { this.location = location; }

    public int getIntensity() { return intensity; }
    public void setIntensity(int intensity) { this.intensity = intensity; }

    @Override
    public String toString() {
        return "Symptom{name='" + name + "', location=" + location + ", intensity=" + intensity + "}";
    }
}
