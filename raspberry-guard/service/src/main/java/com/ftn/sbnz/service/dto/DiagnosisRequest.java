package com.ftn.sbnz.service.dto;

import com.ftn.sbnz.model.model.RaspberryState;
import com.ftn.sbnz.model.model.WeatherMeasurement;
import java.util.List;

public class DiagnosisRequest {
    
    private RaspberryState state;
    private List<WeatherMeasurement> weatherMeasurements;

    public DiagnosisRequest() {}

    public RaspberryState getState() { return state; }
    public void setState(RaspberryState state) { this.state = state; }

    public List<WeatherMeasurement> getWeatherMeasurements() { return weatherMeasurements; }
    public void setWeatherMeasurements(List<WeatherMeasurement> weatherMeasurements) { this.weatherMeasurements = weatherMeasurements; }
}