package com.ftn.sbnz.model.model;

import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
public class WeatherMeasurement {

    private String location;
    private double temperature;
    private double humidity;
    private double rainfall; // mm
    private Date timestamp;

    public WeatherMeasurement() {
        this.timestamp = new Date();
    }

    public WeatherMeasurement(double temperature, double humidity, double rainfall) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.rainfall = rainfall;
        this.timestamp = new Date();
    }

    public WeatherMeasurement(double temperature, double humidity, double rainfall, Date timestamp) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.rainfall = rainfall;
        this.timestamp = timestamp;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }

    public double getRainfall() { return rainfall; }
    public void setRainfall(double rainfall) { this.rainfall = rainfall; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "WeatherMeasurement{temp=" + temperature + ", humidity=" + humidity
                + ", rainfall=" + rainfall + ", timestamp=" + timestamp + "}";
    }
}
