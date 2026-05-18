package com.ftn.sbnz.model.model;

import com.ftn.sbnz.model.enums.SymptomLocation;

public class Symptom {

    private String name;
    private SymptomLocation location;
    private int severity; // 1-10

    public Symptom() {}

    public Symptom(String name, SymptomLocation location, int severity) {
        this.name = name;
        this.location = location;
        this.severity = severity;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SymptomLocation getLocation() { return location; }
    public void setLocation(SymptomLocation location) { this.location = location; }

    public int getSeverity() { return severity; }
    public void setSeverity(int severity) { this.severity = severity; }

    @Override
    public String toString() {
        return "Symptom{name='" + name + "', location=" + location + ", severity=" + severity + "}";
    }
}
